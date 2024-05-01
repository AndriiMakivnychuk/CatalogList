import { IsBoolean, IsEnum, IsNotEmpty, IsString, IsArray, ArrayNotEmpty, Matches, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateCatalogDto {
  @ApiProperty({
    example: 'Catalog Name',
    description: 'The unique name of the catalog'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Matches(/^[a-zA-Z]+$/, {
    message: 'The catalog name should only contain alphabetic characters',
  })
  name: string;

  @ApiProperty({
    example: 'fashion',
    description: 'The vertical of the catalog',
    enum: ['fashion', 'home', 'general']
  })
  @IsNotEmpty()
  @IsEnum(['fashion', 'home', 'general'], { message: 'Vertical must be one of the following values: fashion, home, general' })
  vertical: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the catalog is set as primary'
  })
  @IsBoolean()
  primary: boolean;


  @ApiProperty({
    example: ['en_US', 'es_ES'],
    description: 'List of locales available in the catalog',
    type: [String]
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  // ! Extra checking to make sure that user precified correct locales
  @Matches(/^[a-z]{2}_[A-Z]{2}$/, { each: true, message: 'Each locale must follow the pattern xx_YY.' })
  locales: string[];
}
