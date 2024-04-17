import { Controller, Get, Post, Body,Param,Patch } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';

@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}


  @Post()
  async create(@Body() createCatalogDto: CreateCatalogDto) {
    try {
        return this.catalogsService.create(createCatalogDto);
    }
    catch(e) {
        throw e
    }
  }

  @Get()
  async findAll() {
    try {
        return this.catalogsService.findAll();
    }
    catch(e) {
        throw e
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try{
        const catalog = await this.catalogsService.findById(id);
        return catalog;
    }
    catch(e) {
        throw e
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCatalogDto: UpdateCatalogDto) {
    try {
        return this.catalogsService.updateCatalog(id, updateCatalogDto);
    } catch (e) {
        throw e;
    }
  }
}