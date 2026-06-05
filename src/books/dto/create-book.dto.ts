import { IsString, MinLength, MaxLength, IsOptional, IsUUID } from 'class-validator';
import type { UUID } from 'crypto';

export class CreateBookDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name: string;

  @IsOptional()
  @IsUUID()
  genreId?: UUID;
}