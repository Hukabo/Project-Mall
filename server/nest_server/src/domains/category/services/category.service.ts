import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entity/category.entity';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoryRepository.save(createCategoryDto);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category | null> {
    const res = await this.categoryRepository.findOneBy({ id });

    if (res === null) {
      throw new NotFoundException(`${id} of category not exists...`);
    }
    return res;
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
