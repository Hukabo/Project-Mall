import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { DataSource, ILike, Repository } from 'typeorm';
import { CreateProductDto } from '../dto/create-product.dto';
import { InternalServerError } from 'src/errors/internal-server.error';
import { Category } from 'src/domains/category/entity/category.entity';
import { CloudinaryService } from 'src/domains/image/service/cloudinary.service';
import { Image } from 'src/domains/image/entity/image.entity';
import { ProductView } from '../entity/productView.entity';
import { ProductSpec } from '../entity/productSpec.entity';
import { SaleState } from 'src/enums/saleState.enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Product)
    private readonly productViewRepository: Repository<ProductView>,

    @InjectRepository(Product)
    private readonly productSpecRepository: Repository<ProductSpec>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    files: Array<Express.Multer.File>,
  ): Promise<Product> {
    const { name, description, price, variants, categoryId, imagesInfo } =
      createProductDto;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const category = await queryRunner.manager.findOne(Category, {
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException('해당 카테고리는 없습니다.');
      }

      // Cloudinary 업로드
      const uploadResults = await Promise.all(
        files.map((file) => this.cloudinaryService.uploadImage(file)),
      );

      // Product 생성
      const product = queryRunner.manager.create(Product, {
        name,
        description,
        price,
        category,
        thumbnail: uploadResults[0].secure_url,
      });

      await queryRunner.manager.save(product);

      // ProductView 생성
      const productViews: ProductView[] = [];

      for (const variant of variants) {
        const productView = queryRunner.manager.create(ProductView, {
          color: variant.color ?? '',
          product,
        });

        productViews.push(productView);
        await queryRunner.manager.save(productView);

        // ProductSpec 생성
        const specs = variant.sizeStocks
          .filter((sizeStock) => sizeStock.stock > 0)
          .map((sizeStock) => {
            return queryRunner.manager.create(ProductSpec, {
              size: sizeStock.size,
              stock: sizeStock.stock,
              state:
                sizeStock.stock === 0 ? SaleState.SOLD_OUT : SaleState.ON_SALE,
              sku: `${name}-${variant.color ? `${variant.color}-` : ''}${sizeStock.size}`.toUpperCase(),
              productView,
            });
          });

        await queryRunner.manager.save(specs);
      }

      // Image 생성
      const images = uploadResults.map((res, i) => {
        const variantIndex = imagesInfo[i];

        return queryRunner.manager.create(Image, {
          id: res.public_id,
          secure_url: res.secure_url,
          name: res.original_filename,
          format: res.format,
          productView: productViews[variantIndex],
          sortOrder: i,
        });
      });

      await queryRunner.manager.save(images);

      await queryRunner.commitTransaction();

      return product;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findById(id: number) {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: {
          productViews: {
            images: true,
            productSpecs: true,
          },
        },
        order: {
          productViews: {
            images: {
              sortOrder: 'ASC',
            },
            productSpecs: {
              id: 'ASC',
            },
          },
        },
      });

      if (!product) {
        throw new NotFoundException('해당 상품이 존재하지 않습니다.');
      }

      return product;
    } catch (error) {
      console.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerError(
        'Something went wrong while finding the product...',
        error,
      );
    }
  }

  async findPage(page: number, limit: number, search?: string): Promise<{}> {
    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('category.parent', 'parent');

    if (search) {
      qb.where('product.name ILIKE :search', {
        search: `%${search}%`,
      })
        .orWhere('category.name ILIKE :search', {
          search: `%${search}%`,
        })
        .orWhere('parent.name ILIKE :search', {
          serach: `%${search}%`,
        });
    }

    qb.skip((page - 1) * limit)
      .take(limit)
      .orderBy('product.id', 'DESC');

    const [products, total] = await qb.getManyAndCount();

    return {
      products,
      total,
      page,
      limit,
      hasNext: page * limit < total,
    };
  }

  async findImages(productId: number) {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
      relations: {
        productViews: {
          images: true,
        },
      },
    });

    if (!product) {
      throw new NotFoundException('해당 상품을 찾을 수 없습니다.');
    }

    const images = await this.imageRepository.find({
      where: {
        productView: product.productViews,
      },
      relations: {
        productView: true,
      },
    });

    return images;
  }

  // async update(
  //   id: number,
  //   updateProductDto: UpdateProductDto,
  // ): Promise<Product> {
  //   const { name, description, price, stock, categoryId } = updateProductDto;

  //   const product = await this.productRepository.findOne({
  //     where: { id },
  //     relations: { category: true },
  //   });

  //   if (!product) {
  //     throw new NotFoundException('the product is not exists...');
  //   }

  //   product.name = name;
  //   product.description = description;
  //   product.price = price;
  //   product.stock = stock;

  //   if (categoryId) {
  //     const category = await this.categoryRepository.findOneBy({
  //       id: categoryId,
  //     });
  //     if (category) {
  //       product.category = category;
  //     }
  //   }

  //   return await this.productRepository.save(product);
  // }

  async delete(id: number): Promise<string> {
    try {
      const res = await this.productRepository.softDelete(id);

      if (!res.affected) {
        throw new NotFoundException('the product not exists...');
      }

      return 'delete product success...';
    } catch (error) {
      console.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerError(
        'Something went wrong while deleting the product...',
        error,
      );
    }
  }
}
