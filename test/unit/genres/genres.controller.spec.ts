import { Test, TestingModule } from '@nestjs/testing';
import { GenresController } from 'src/genres/genres.controller';
import { GenresService } from 'src/genres/genres.service';

const mockGenreId = '660e8400-e29b-41d4-a716-446655440001' as const;

const mockGenre = {
  id: mockGenreId,
  name: 'Ficção',
  created_at: new Date(),
  books: [],
};

describe('GenresController', () => {
  let controller: GenresController;
  let service: GenresService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenresController],
      providers: [{ provide: GenresService, useValue: mockService }],
    }).compile();

    controller = module.get<GenresController>(GenresController);
    service = module.get<GenresService>(GenresService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /genres', () => {
    it('delega para service.create', async () => {
      const dto = { name: 'Ficção' };
      mockService.create.mockResolvedValue(mockGenre);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockGenre);
    });
  });

  describe('GET /genres', () => {
    it('delega para service.findAll', async () => {
      mockService.findAll.mockResolvedValue([mockGenre]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockGenre]);
    });
  });

  describe('GET /genres/:id', () => {
    it('delega para service.findOne', async () => {
      mockService.findOne.mockResolvedValue(mockGenre);

      const result = await controller.findOne(mockGenre.id);

      expect(service.findOne).toHaveBeenCalledWith(mockGenre.id);
      expect(result).toEqual(mockGenre);
    });
  });

  describe('PATCH /genres/:id', () => {
    it('delega para service.update', async () => {
      const dto = { name: 'Fantasia' };
      const updated = { ...mockGenre, name: 'Fantasia' };
      mockService.update.mockResolvedValue(updated);

      const result = await controller.update(mockGenre.id, dto);

      expect(service.update).toHaveBeenCalledWith(mockGenre.id, dto);
      expect(result).toEqual(updated);
    });
  });

  describe('DELETE /genres/:id', () => {
    it('delega para service.remove', async () => {
      mockService.remove.mockResolvedValue(mockGenre);

      const result = await controller.remove(mockGenre.id);

      expect(service.remove).toHaveBeenCalledWith(mockGenre.id);
      expect(result).toEqual(mockGenre);
    });
  });
});
