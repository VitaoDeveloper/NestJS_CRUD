import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from 'src/books/books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from 'src/books/entities/book.entity';
import { GenresService } from 'src/genres/genres.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { UUID } from 'crypto';

const mockBookId = '550e8400-e29b-41d4-a716-446655440000' as const;
const mockGenreId = '660e8400-e29b-41d4-a716-446655440001' as const;
const inexistentId = '00000000-0000-0000-0000-000000000000' as const;
const unknownGenreId = '00000000-0000-0000-0000-000000000001' as const;
const newGenreId = '770e8400-e29b-41d4-a716-446655440002' as const;

const mockBook = {
  id: mockBookId,
  name: '1984',
  genreId: mockGenreId,
  createdAt: new Date(),
  genreRelation: { id: mockGenreId, name: 'Ficção' },
};

const mockGenre = {
  id: mockGenreId,
  name: 'Ficção',
};

describe('BooksService', () => {
  let service: BooksService;
  let repo: any;
  let genresService: any;

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    genresService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: getRepositoryToken(Book), useValue: repo },
        { provide: GenresService, useValue: genresService },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  describe('create', () => {
    it('cria livro sem gênero', async () => {
      const dto = { name: '1984' };
      repo.create.mockReturnValue({ name: '1984' });
      repo.save.mockResolvedValue({ id: '1', name: '1984' });

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith({ name: '1984' });
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual({ id: '1', name: '1984' });
    });

    it('cria livro com gênero válido', async () => {
      const dto = { name: '1984', genreId: mockGenre.id };
      repo.create.mockReturnValue({ name: '1984' });
      genresService.findOne.mockResolvedValue(mockGenre);
      repo.save.mockResolvedValue(mockBook);

      const result = await service.create(dto);

      expect(genresService.findOne).toHaveBeenCalledWith(mockGenre.id);
      expect(repo.create).toHaveBeenCalledWith({ name: '1984' });
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });

    it('rejeita genreId nulo', async () => {
      await expect(service.create({ name: '1984', genreId: null } as any))
        .rejects
        .toThrow(BadRequestException);
    });

    it('rejeita gênero inexistente', async () => {
      const dto = { name: '1984', genreId: unknownGenreId };
      genresService.findOne.mockRejectedValue(new NotFoundException());

      await expect(service.create(dto))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('retorna lista de livros com relações', async () => {
      repo.find.mockResolvedValue([mockBook]);

      const result = await service.findAll();

      expect(repo.find).toHaveBeenCalledWith({
        relations: { genreRelation: true },
      });
      expect(result).toEqual([mockBook]);
    });
  });

  describe('findOne', () => {
    it('retorna livro por id', async () => {
      repo.findOne.mockResolvedValue(mockBook);

      const result = await service.findOne(mockBook.id);

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: mockBook.id },
        relations: { genreRelation: true },
      });
      expect(result).toEqual(mockBook);
    });

    it('lança NotFoundException se não encontrar', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOne(inexistentId))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('atualiza apenas o nome', async () => {
      const dto = { name: 'Animal Farm' };
      const updated = { ...mockBook, name: 'Animal Farm' };

      repo.findOne.mockResolvedValue(mockBook);
      repo.save.mockResolvedValue(updated);

      const result = await service.update(mockBook.id, dto);

      expect(result.name).toBe('Animal Farm');
      expect(result.genreRelation).toEqual(mockBook.genreRelation);
    });

    it('atualiza o gênero', async () => {
      const newGenre = { id: newGenreId, name: 'Distopia' };
      const dto = { genreId: newGenre.id };

      repo.findOne.mockResolvedValue(mockBook);
      genresService.findOne.mockResolvedValue(newGenre);
      repo.save.mockResolvedValue({ ...mockBook, genreRelation: newGenre });

      const result = await service.update(mockBook.id, dto);

      expect(genresService.findOne).toHaveBeenCalledWith(newGenre.id);
      expect(result.genreRelation).toEqual(newGenre);
    });

    it('rejeita genreId nulo no update', async () => {
      repo.findOne.mockResolvedValue(mockBook);

      await expect(service.update(mockBook.id, { genreId: null } as any))
        .rejects
        .toThrow(BadRequestException);
    });

    it('rejeita gênero inexistente no update', async () => {
      const dto = { genreId: unknownGenreId };
      repo.findOne.mockResolvedValue(mockBook);
      genresService.findOne.mockRejectedValue(new NotFoundException());

      await expect(service.update(mockBook.id, dto))
        .rejects
        .toThrow(NotFoundException);
    });

    it('lança NotFoundException se livro não existe', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.update(inexistentId, { name: 'X' }))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('remove livro existente', async () => {
      repo.findOne.mockResolvedValue(mockBook);
      repo.remove.mockResolvedValue(mockBook);

      const result = await service.remove(mockBook.id);

      expect(repo.remove).toHaveBeenCalledWith(mockBook);
      expect(result).toEqual(mockBook);
    });

    it('lança NotFoundException se livro não existe', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.remove(inexistentId))
        .rejects
        .toThrow(NotFoundException);
    });
  });
});
