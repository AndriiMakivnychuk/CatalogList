import { IsBoolean, IsEnum, IsNotEmpty, IsString, IsArray, ArrayNotEmpty, Matches, MaxLength } from 'class-validator';


export class CreateCatalogDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsEnum(['fashion', 'home', 'general'], { message: 'Vertical must be one of the following values: fashion, home, general' })
  vertical: string;

  @IsBoolean()
  primary: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  // ! Extra checking to make sure that user precified correct locales
  @Matches(/^[a-z]{2}_[A-Z]{2}$/, { each: true, message: 'Each locale must follow the pattern xx_YY.' })
  locales: string[];
}