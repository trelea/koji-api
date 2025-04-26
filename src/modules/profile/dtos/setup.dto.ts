import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsDateString,
  Matches,
} from 'class-validator';

export class SetupDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 25)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'hashname can only contain letters, numbers, and underscores',
  })
  hashname: string;

  @IsNotEmpty()
  @IsDateString()
  date_birth: Date;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  description?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  bio?: string;
}
