import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateGenreDto {
  @ApiProperty({
    description: 'Nome do gênero literário',
    example: 'Romance',
    maxLength: 80,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name: string
}