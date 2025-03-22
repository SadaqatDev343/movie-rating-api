import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsArray,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'Inception' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'A mind-bending thriller' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 2010 })
  @IsNotEmpty()
  @IsNumber()
  releaseYear: number;

  @ApiProperty({
    example: ['67defb0f390df5253f109d0a', '67defb0f390df5253f109d0b'],
    description: 'Array of Category IDs',
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  categories: string[];
}

export class RateMovieDto {
  @ApiProperty({ example: '67dc5c12f8546a6146ae1613' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ example: 4 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
