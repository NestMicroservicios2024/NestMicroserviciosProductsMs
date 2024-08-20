import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit{

  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  create(createProductDto: CreateProductDto) {

    return this.product.create({
      data: createProductDto
    });

  }

  async findAll(paginationDto: PaginationDto) {

    const {page, limit} = paginationDto;

    const totalPages = await this.product.count({where: {available: true}}); //Esto en realidad deberia llamarse total porque es el total de productos

    const lastPage = Math.ceil(totalPages / limit); //Esto seria el total de paginas

    //Con toda esta info se podria mandar un error si se pide una pagina q no tiene productos

    return {
      data: await this.product.findMany({
        skip: (page - 1) * 10,
        take: limit,
        where: {
          available: true
        }
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage
      }
    }

  }

  async findOne(id: number) {

    const product = await this.product.findFirst({
      where: {id, available: true}
    });

    if(!product){
      throw new RpcException({
        message: `Product with id #${id} not found`,
        status: HttpStatus.BAD_REQUEST
      });
    }

    return product;

  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    //Se puede comprobar si el updateProductDto viene vacio entonces q no haga nada, porque no hay nada q actualizar

    const {id: __, ...data} = updateProductDto; //Borramos el id del dto

    await this.findOne(id);

    return this.product.update({
      where: {id},
      data: data
    });

  }

  async remove(id: number) {

    await this.findOne(id);

    //HARD DELETE

    // return this.product.delete({
    //   where: {id}
    // });

    //SOFT DELETE

    const product = await this.product.update({
      where: {id},
      data: {
        available: false
      }
    });

    return product;

  }
}
