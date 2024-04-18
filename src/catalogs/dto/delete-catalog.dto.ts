import { IsMongoId, IsArray, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteCatalogDto {
  @ApiProperty({
    example: 'Catalog ID',
    description: 'An ID of the catalog we want to delete'
  })
  @IsMongoId()
  id: string;
}

export class DeleteMultipleCatalogsDto {
    @ApiProperty({
      example: ['6620f7b4588f9fb7220c744', '6620f7b4588f9fb7220c743'],
      description: 'List of catalog"s ids',
      type: [String]
    })
    @IsArray()
    @ArrayNotEmpty({ message: 'The ids array must not be empty' })
    @IsMongoId({ each: true, message: 'Each id must be a valid MongoDB ObjectId' })
    ids: string[];
  }