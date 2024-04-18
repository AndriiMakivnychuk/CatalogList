import { Controller, Get, Post, Body,Param,Patch,Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { DeleteCatalogDto } from './dto/delete-catalog.dto';
import { DeleteMultipleCatalogsDto } from './dto/delete-catalog.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}


  @Post()
  @ApiOperation({ summary: 'Create a new catalog' })
  @ApiResponse({ status: 201, description: 'The catalog has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: CreateCatalogDto })
  async create(@Body() createCatalogDto: CreateCatalogDto) {
    try {
        return this.catalogsService.create(createCatalogDto);
    }
    catch(e) {
        throw e
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all catalogs' })
  @ApiResponse({ status: 200, description: 'Return all catalogs.' })
  async findAll() {
    try {
        return this.catalogsService.findAll();
    }
    catch(e) {
        throw e
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a catalog by ID' })
  @ApiParam({ name: 'id', description: 'Catalog ID' })
  @ApiResponse({ status: 200, description: 'Return the catalog with the specified ID.' })
  @ApiResponse({ status: 404, description: 'Catalog not found.' })
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
  @ApiOperation({ summary: 'Update a catalog' })
  @ApiParam({ name: 'id', description: 'Catalog ID' })
  @ApiResponse({ status: 200, description: 'The catalog has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Catalog not found.' })
  @ApiBody({ type: UpdateCatalogDto })
  async update(@Param('id') id: string, @Body() updateCatalogDto: UpdateCatalogDto) {
    try {
        return this.catalogsService.updateCatalog(id, updateCatalogDto);
    } catch (e) {
        throw e;
    }
  }

  @Delete('/bulk-delete')
  @ApiOperation({ summary: 'Delete multiple catalogs' })
  @ApiResponse({ status: 204, description: 'The catalogs have been successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiBody({ type: DeleteMultipleCatalogsDto })
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
  @ApiOperation({ summary: 'Delete a catalog' })
  @ApiParam({ name: 'id', description: 'Catalog ID' })
  @ApiResponse({ status: 204, description: 'The catalog has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Catalog not found.' })
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