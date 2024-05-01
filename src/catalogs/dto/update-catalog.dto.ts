import { IsBoolean, IsEnum, IsOptional, IsString, IsArray, ArrayNotEmpty, Matches, MaxLength,IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCatalogDto {
  @ApiProperty({
    example: 'Catalog Name',
    description: 'The unique name of the catalog'
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Matches(/^[a-zA-Z]+$/, {
    message: 'The catalog name should only contain alphabetic characters',
  })
  name?: string;


  @ApiProperty({
    example: 'fashion',
    description: 'The vertical of the catalog',
    enum: ['fashion', 'home', 'general']
  })
  @IsOptional()
  @IsEnum(['fashion', 'home', 'general'], { message: 'Vertical must be one of the following values: fashion, home, general' })
  vertical?: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the catalog is set as primary'
  })
  @IsOptional()
  @IsBoolean()
  primary?: boolean;

  @ApiProperty({
    example: ['en_US', 'es_ES'],
    description: 'List of locales available in the catalog',
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @Matches(/^[a-z]{2}_[A-Z]{2}$/, { each: true, message: 'Each locale must follow the pattern xx_YY.' })
  locales?: string[];

}
