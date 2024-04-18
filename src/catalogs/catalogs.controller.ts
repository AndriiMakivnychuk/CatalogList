import { Controller, Get, Post, Body,Param,Patch,Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { DeleteCatalogDto } from './dto/delete-catalog.dto';
import { DeleteMultipleCatalogsDto } from './dto/delete-catalog.dto';

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

  @Delete('/bulk-delete')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async deleteMultipleCatalogs(@Body() deleteDto: DeleteMultipleCatalogsDto) {
    try {
      await this.catalogsService.deleteMultipleCatalogs(deleteDto.ids);
      return { message: 'Catalogs deleted successfully' };
    } catch (e) {
      throw e;
    }
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async deleteCatalog(@Param() params: DeleteCatalogDto) {
    try {
      await this.catalogsService.deleteCatalog(params.id);
      return { message: 'Catalog deleted successfully' };
    } catch (e) {
      throw e
    }
  }

}