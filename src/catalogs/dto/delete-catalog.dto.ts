import { IsMongoId, IsArray, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteCatalogDto {
  @IsMongoId()
  id: string;
}

export class DeleteMultipleCatalogsDto {
    @IsArray()
    @ArrayNotEmpty({ message: 'The ids array must not be empty' })
    @IsMongoId({ each: true, message: 'Each id must be a valid MongoDB ObjectId' })
    ids: string[];
  }