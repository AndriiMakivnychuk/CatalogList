import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Catalog, CatalogDocument } from './schemas/catalog.schema';

@Injectable()
export class CatalogsService {
  constructor(@InjectModel(Catalog.name) private catalogModel: Model<CatalogDocument>) {}

  async create(createCatalogDto: any): Promise<Catalog> {
    try {
        //! Checking do we really need to update primary property in others catalogs
        if (createCatalogDto.primary) {
            const existingPrimary = await this.catalogModel.findOne({
                vertical: createCatalogDto.vertical,
                primary: true
            });
            if (existingPrimary) {
                await this.catalogModel.updateOne({
                    _id: existingPrimary._id
                }, {
                    $set: { primary: false }
                });
            }
        }

        createCatalogDto.isMultilocale = createCatalogDto.locales.length > 1;

        return this.catalogModel.create(createCatalogDto);
    } catch (e) {
        console.error("Error during crearting a catalog:", e);
        throw e;
    }
  }

  async findAll(): Promise<Catalog[]> {
    try {
        return this.catalogModel.find().exec();
    }
    catch(e) {
        console.error("Error fetching catalogs:", e);
        throw e
    }
  }

  async findById(id: string): Promise<Catalog> {
    try {
        const catalog = await this.catalogModel.findById(id).exec();
        if (!catalog) {
          throw new Error(`Catalog with ID '${id}' not found.`);
        }
        return catalog;
    }
    catch(e) {
        console.error(e)
        throw e
    }

  }

  async updateCatalog(id: string, updateDto: any): Promise<Catalog> {
    try {
      const catalog = await this.catalogModel.findById(id).exec();
      if (!catalog) {
        throw new Error(`Catalog with ID '${id}' not found.`);
      }
  
      if (updateDto.primary) {
        const existingPrimary = await this.catalogModel.findOne({
          vertical: updateDto.vertical || catalog.vertical, //! We need to use current vertical if new one is not provided
          primary: true,
          _id: { $ne: id }
        });
  
        if (existingPrimary) {
          await this.catalogModel.updateOne({
            _id: existingPrimary._id
          }, {
            $set: { primary: false }
          });
        }
      }
  
      if (updateDto.locales) {
        updateDto.isMultilocale = updateDto.locales.length > 1;
      }
  
      await this.catalogModel.findByIdAndUpdate(id, updateDto, { new: true });
      return this.catalogModel.findById(id).exec();
    } catch (e) {
      console.error("Error updating catalog:", e);
      throw e;
    }
  }

  async deleteCatalog(id: string): Promise<void> {
    const result = await this.catalogModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new Error(`Catalog with ID '${id}' not found.`);
    }
  }
  
  async deleteMultipleCatalogs(ids: string[]): Promise<void> {
    const result = await this.catalogModel.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      throw new Error('No catalogs found to delete.');
    }
  }
  
}
