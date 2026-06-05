import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenresModule } from './genres/genres.module';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      database: 'library',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    GenresModule, BooksModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
