import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from 'src/books/books.controller';
import { BooksService } from 'src/books/books.service';

const mockBookId = '550e8400-e29b-41d4-a716-446655440000' as const;
const mockGenreId = '660e8400-e29b-41d4-a716-446655440001' as const;

const mockBook = {
  id: mockBookId,
  name: '1984',
  genreId: mockGenreId,
  createdAt: new Date(),
  genreRelation: { id: mockGenreId, name: 'Ficção' },
};

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [{ provide: BooksService, useValue: mockService }],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /books', () => {
    it('delega para service.create', async () => {
      const dto = { name: '1984', genreId: mockBook.genreId };
      mockService.create.mockResolvedValue(mockBook);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockBook);
    });
  });

  describe('GET /books', () => {
    it('delega para service.findAll', async () => {
      mockService.findAll.mockResolvedValue([mockBook]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockBook]);
    });
  });

  describe('GET /books/:id', () => {
    it('delega para service.findOne', async () => {
      mockService.findOne.mockResolvedValue(mockBook);

      const result = await controller.findOne(mockBook.id);

      expect(service.findOne).toHaveBeenCalledWith(mockBook.id);
      expect(result).toEqual(mockBook);
    });
  });

  describe('PATCH /books/:id', () => {
    it('delega para service.update', async () => {
      const dto = { name: 'Animal Farm' };
      const updated = { ...mockBook, name: 'Animal Farm' };
      mockService.update.mockResolvedValue(updated);

      const result = await controller.update(mockBook.id, dto);

      expect(service.update).toHaveBeenCalledWith(mockBook.id, dto);
      expect(result).toEqual(updated);
    });
  });

  describe('DELETE /books/:id', () => {
    it('delega para service.remove', async () => {
      mockService.remove.mockResolvedValue(mockBook);

      const result = await controller.remove(mockBook.id);

      expect(service.remove).toHaveBeenCalledWith(mockBook.id);
      expect(result).toEqual(mockBook);
    });
  });
});
