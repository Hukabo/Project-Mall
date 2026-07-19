import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Category } from '../entity/category.entity';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);

    if (createCategoryDto.parentId) {
      category.parent = { id: createCategoryDto.parentId } as Category;
    }

    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      relations: {
        parent: true,
        products: true,
        children: true,
      },
    });
  }

  async findOne(id: number): Promise<Category> {
    const res = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        parent: true,
        products: true,
        children: true,
      },
    });

    if (res === null) {
      throw new NotFoundException(`${id} of category not exists...`);
    }
    return res;
  }

  async findRoot() {
    return await this.categoryRepository.find({
      where: { parent: undefined },
      relations: {
        children: {
          products: true,
        },
      },
    });
  }

  async findParent() {
    return await this.categoryRepository.find({
      where: {
        parent: IsNull(),
      },
      relations: {
        children: true,
      },
    });
  }

  async findChildren() {
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.children', 'child')
      .where('child.id IS NULL')
      .select(['category.id'])
      .getMany();

    const categoriesId: number[] = [];

    categories.forEach((category) => {
      categoriesId.push(category.id);
    });

    return categoriesId;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { name } = updateCategoryDto;
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException('the category is not exists...');
    }

    category.name = name;

    return await this.categoryRepository.save(category);
  }

  async delete(id: number) {
    return await this.categoryRepository.delete(id);
  }
}
