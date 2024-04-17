import { Test, TestingModule } from '@nestjs/testing';
import { CatalogsService } from './catalogs.service';
import { getModelToken } from '@nestjs/mongoose';
import { Catalog } from './schemas/catalog.schema';

describe('CatalogsService', () => {
  let service: CatalogsService;
  let mockCatalogModel: any;

  beforeEach(async () => {
    mockCatalogModel = {
        find: jest.fn(),
        findOne: jest.fn(),
        updateMany: jest.fn(),
        updateOne: jest.fn(),
        create: jest.fn(),
        findById: jest.fn() ,
        findByIdAndUpdate: jest.fn()
      };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogsService,
        {
          provide: getModelToken(Catalog.name),
          useValue: mockCatalogModel,
        },
      ],
    }).compile();

    service = module.get<CatalogsService>(CatalogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

    describe('create', () => {
    it('should set existing primary catalog to non-primary and create a new primary catalog', async () => {
        const existingCatalog = { _id: 'existingId', name: 'Existing Catalog', vertical: 'fashion', primary: true };
        mockCatalogModel.findOne.mockResolvedValue(existingCatalog);
        mockCatalogModel.updateOne.mockResolvedValue({});

        const dto = { name: 'New Catalog', vertical: 'fashion', primary: true, locales: ['en_US'] };
        mockCatalogModel.create.mockResolvedValue({
        ...dto,
        save: jest.fn()
        });

        const result = await service.create(dto);

        //! If findOne was called
        expect(mockCatalogModel.findOne).toHaveBeenCalledWith({
        vertical: 'fashion', primary: true
        });

        //! If updateOne was called
        expect(mockCatalogModel.updateOne).toHaveBeenCalledWith(
        { _id: existingCatalog._id },
        { $set: { primary: false } }
        );
        
        expect(mockCatalogModel.create).toHaveBeenCalledWith(dto);
        expect(result.primary).toBe(true);
        expect(result.name).toEqual('New Catalog');
    });
    it('should create a new primary catalog when no other primary exists', async () => {
        const dto = { name: 'New Primary Catalog', vertical: 'fashion', primary: true, locales: ['en_US'] };
        mockCatalogModel.findOne.mockResolvedValue(null);
        mockCatalogModel.create.mockResolvedValue({ ...dto });
        
        const result = await service.create(dto);
        
        expect(mockCatalogModel.findOne).toHaveBeenCalledWith({ vertical: 'fashion', primary: true });
        expect(mockCatalogModel.updateOne).not.toHaveBeenCalled();
        expect(mockCatalogModel.create).toHaveBeenCalledWith(dto);
        expect(result.primary).toBe(true);
        expect(result.name).toEqual('New Primary Catalog');
        });
    it('should create a new catalog as non-primary when specified', async () => {
        const dto = { name: 'New Catalog', vertical: 'fashion', primary: false, locales: ['en_US'] };
        mockCatalogModel.findOne.mockResolvedValue(null);
        mockCatalogModel.create.mockResolvedValue({
        ...dto,
        primary: false,
        save: jest.fn()
        });

        const result = await service.create(dto);

        expect(mockCatalogModel.findOne).not.toHaveBeenCalled();
        expect(mockCatalogModel.updateOne).not.toHaveBeenCalled();

        expect(mockCatalogModel.create).toHaveBeenCalledWith(dto);
        expect(result.primary).toBe(false);
        expect(result.name).toEqual('New Catalog');
    });
    it('should mark isMultilocale as false when there is only one locale', async () => {
        const dto = { name: 'Single Locale Catalog', vertical: 'fashion', primary: true, locales: ['en_US'] };
        mockCatalogModel.create.mockResolvedValue({ ...dto, isMultilocale: false });

        const result = await service.create(dto);

        expect(mockCatalogModel.create).toHaveBeenCalledWith(expect.objectContaining({
            isMultilocale: false
        }));
        expect(result.isMultilocale).toBe(false);
        });
    it('should mark isMultilocale as true when there are multiple locales', async () => {
    const dto = { name: 'Multi Locale Catalog', vertical: 'fashion', primary: true, locales: ['en_US', 'fr_FR'] };
    mockCatalogModel.create.mockResolvedValue({ ...dto, isMultilocale: true });

    const result = await service.create(dto);

    expect(mockCatalogModel.create).toHaveBeenCalledWith(expect.objectContaining({
        isMultilocale: true
    }));
    expect(result.isMultilocale).toBe(true);
    });
    });

    describe('search', () => {
        it('should return an array of catalogs', async () => {
            const catalogArray = [
            { name: 'Catalog 1', vertical: 'fashion', primary: true, locales: ['en_US'] },
            { name: 'Catalog 2', vertical: 'home', primary: false, locales: ['en_GB'] }
            ];
            mockCatalogModel.find.mockReturnValue({
            exec: jest.fn().mockResolvedValue(catalogArray)
            });
        
            const result = await service.findAll();
            expect(result).toEqual(catalogArray);
            expect(mockCatalogModel.find().exec).toHaveBeenCalled();
        });

        it('should return an empty array when no catalogs are found', async () => {
            mockCatalogModel.find.mockReturnValue({
            exec: jest.fn().mockResolvedValue([])
            });
        
            const result = await service.findAll();
            expect(result).toEqual([]);
            expect(mockCatalogModel.find().exec).toHaveBeenCalled();
        });
        
        it('should throw an error if there is a problem fetching the catalogs', async () => {
            const error = new Error('Error fetching catalogs');
            mockCatalogModel.find.mockReturnValue({
            exec: jest.fn().mockRejectedValue(error)
            });
        
            await expect(service.findAll()).rejects.toThrow(error);
        });  
    })
    
    describe('searchById', () => {
        it('should return a catalog when it is found by ID', async () => {
            const catalogData = { _id:"661fc722f95c3e0950a56baf",name: 'Catalog 1', vertical: 'fashion', primary: true, locales: ['en_US'] };
            mockCatalogModel.findById.mockReturnValue({
              exec: jest.fn().mockResolvedValue(catalogData)
            });
          
            const result = await service.findById('661fc722f95c3e0950a56baf');
            expect(result).toEqual(catalogData);
            expect(mockCatalogModel.findById).toHaveBeenCalledWith('661fc722f95c3e0950a56baf');
          });
        it('should throw an error if no catalog is found with the provided ID', async () => {
            mockCatalogModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null)
            });
            
            await expect(service.findById('661fc722f95c3e0950a56baf')).rejects.toThrow('Catalog with ID \'661fc722f95c3e0950a56baf\' not found.');
        });
        it('should handle errors when database query fails', async () => {
            const error = new Error('Database query failed');
            mockCatalogModel.findById.mockReturnValue({
              exec: jest.fn().mockRejectedValue(error)
            });
          
            await expect(service.findById('someId')).rejects.toThrow(error);
        });
    })



});