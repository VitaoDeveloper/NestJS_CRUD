import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { GenresService } from '../genres/genres.service';
import { UUID } from 'crypto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private repo: Repository<Book>,
    private genresService: GenresService, // injetado
  ) {}

  async create(dto: CreateBookDto) {
    if (dto.genreId === null)
      throw new BadRequestException('genreId não pode ser nulo');

    const book = this.repo.create({ name: dto.name });
    if (dto.genreId) {
      const genre = await this.genresService.findOne(dto.genreId);
      book.genreRelation = genre;
    }
    return this.repo.save(book);
  }

  findAll() {
    return this.repo.find({ relations: { genreRelation: true } });
  }

  async findOne(id: UUID) {
    const book = await this.repo.findOne({
      where: { id },
      relations: { genreRelation: true },
    });
    if (!book) throw new NotFoundException(`Livro #${id} não encontrado`);
    return book;
  }

  async update(id: UUID, dto: UpdateBookDto) {
    const book = await this.findOne(id);

    if (dto.genreId === null)
      throw new BadRequestException('genreId não pode ser nulo');

    if (dto.name !== undefined) book.name = dto.name;
    if (dto.genreId !== undefined) {
      const genre = await this.genresService.findOne(dto.genreId);
      book.genreRelation = genre;
    }
    return this.repo.save(book);
  }

  async remove(id: UUID) {
    const book = await this.findOne(id);
    return this.repo.remove(book);
  }
}
