import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from 'src/genres/genres.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Genre } from 'src/genres/entities/genre.entity';
import { NotFoundException } from '@nestjs/common';
import type { UUID } from 'crypto';

const mockGenreId = '660e8400-e29b-41d4-a716-446655440001' as const;
const inexistentId = '00000000-0000-0000-0000-000000000000' as const;

const mockGenre = {
  id: mockGenreId,
  name: 'Ficção',
  created_at: new Date(),
  books: [],
};

describe('GenresService', () => {
  let service: GenresService;
  let repo: any;

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresService,
        { provide: getRepositoryToken(Genre), useValue: repo },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
  });

  describe('create', () => {
    it('cria um gênero', async () => {
      const dto = { name: 'Ficção' };
      repo.create.mockReturnValue({ name: 'Ficção' });
      repo.save.mockResolvedValue(mockGenre);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(mockGenre);
    });
  });

  describe('findAll', () => {
    it('retorna todos os gêneros com livros', async () => {
      repo.find.mockResolvedValue([mockGenre]);

      const result = await service.findAll();

      expect(repo.find).toHaveBeenCalledWith({
        relations: { books: true },
      });
      expect(result).toEqual([mockGenre]);
    });
  });

  describe('findOne', () => {
    it('retorna gênero por id', async () => {
      repo.findOne.mockResolvedValue(mockGenre);

      const result = await service.findOne(mockGenre.id);

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: mockGenre.id },
        relations: { books: true },
      });
      expect(result).toEqual(mockGenre);
    });

    it('lança NotFoundException se não encontrar', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOne(inexistentId))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('findByName', () => {
    it('retorna gênero pelo nome', async () => {
      repo.findOne.mockResolvedValue(mockGenre);

      const result = await service.findByName('Ficção');

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { name: 'Ficção' },
      });
      expect(result).toEqual(mockGenre);
    });

    it('retorna null quando não encontra', async () => {
      repo.findOne.mockResolvedValue(null);

      const result = await service.findByName('Inexistente');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('atualiza nome do gênero', async () => {
      const dto = { name: 'Fantasia' };
      const updated = { ...mockGenre, name: 'Fantasia' };

      repo.findOne.mockResolvedValue(mockGenre);
      repo.save.mockResolvedValue(updated);

      const result = await service.update(mockGenre.id, dto);

      expect(result.name).toBe('Fantasia');
    });

    it('lança NotFoundException se gênero não existe', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.update(inexistentId, { name: 'X' }))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('remove gênero existente', async () => {
      repo.findOne.mockResolvedValue(mockGenre);
      repo.remove.mockResolvedValue(mockGenre);

      const result = await service.remove(mockGenre.id);

      expect(repo.remove).toHaveBeenCalledWith(mockGenre);
      expect(result).toEqual(mockGenre);
    });

    it('lança NotFoundException se gênero não existe', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.remove(inexistentId))
        .rejects
        .toThrow(NotFoundException);
    });
  });
});
