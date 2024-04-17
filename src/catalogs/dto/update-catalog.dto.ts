import { IsBoolean, IsEnum, IsOptional, IsString, IsArray, ArrayNotEmpty, Matches, MaxLength,IsNotEmpty } from 'class-validator';

export class UpdateCatalogDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsEnum(['fashion', 'home', 'general'], { message: 'Vertical must be one of the following values: fashion, home, general' })
  vertical?: string;

  @IsOptional()
  @IsBoolean()
  primary?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @Matches(/^[a-z]{2}_[A-Z]{2}$/, { each: true, message: 'Each locale must follow the pattern xx_YY.' })
  locales?: string[];

}