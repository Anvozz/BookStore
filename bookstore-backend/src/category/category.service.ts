import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceResponse } from 'src/classes/ServiceResponse';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<ServiceResponse<any>> {
    const resp = new ServiceResponse();
    try {
      await this.categoryRepository.save(createCategoryDto);
      resp.message = 'Create category successfully.';
    } catch (error) {
      resp.message = error;
    }

    return resp;
  }

  async findAll(): Promise<ServiceResponse<Category[]>> {
    const resp = new ServiceResponse<Category[]>();
    resp.data = await this.categoryRepository.find();
    return resp;
  }

  async findOne(id: number): Promise<ServiceResponse<Category | null>> {
    const resp = new ServiceResponse<Category>();
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category)
      throw new HttpException(
        `Category id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    resp.data = category;
    return resp;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ServiceResponse<any>> {
    const resp = new ServiceResponse();
    const update = await this.categoryRepository.update(id, updateCategoryDto);
    if (update.affected === 0)
      throw new HttpException(
        `Update category id ${id} not successfully. `,
        HttpStatus.NOT_FOUND,
      );
    resp.message = `Update category id ${id} successfully.`;
    return resp;
  }

  async remove(id: number): Promise<ServiceResponse<any>> {
    const resp = new ServiceResponse();
    const deletes = await this.categoryRepository.delete(id);
    if (deletes.affected === 0)
      throw new HttpException(
        `Delete category id ${id} not successfully. `,
        HttpStatus.NOT_FOUND,
      );
    resp.message = `Delete category id ${id} successfully.`;
    return resp;
  }
}
