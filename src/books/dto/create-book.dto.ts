import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional, IsUUID } from 'class-validator';
import type { UUID } from 'crypto';

export class CreateBookDto {
  @ApiProperty({
    description: 'Nome do livro',
    example: 'Dom Casmurro',
    maxLength: 80,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name: string;

  @ApiProperty({
    description: 'ID do gênero',
    format: 'uuid'
  })
  @IsOptional()
  @IsUUID()
  genreId?: UUID;
}