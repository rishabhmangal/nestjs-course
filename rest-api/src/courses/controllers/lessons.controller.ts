import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { LessonsRepository } from '../repositories/lessons.repository';

@Controller('lessons')
export class LessonsController {
  constructor(@Inject(LessonsRepository) private lessonsDB) {}

  @Get()
  searchLesson(
    @Query('courseId') courseId: string,
    @Query('sortOrder') sortOrder = 'asc',
    @Query('pageNumber', ParseIntPipe) pageNumber = 0,
    @Query('pageSize', ParseIntPipe) pageSize = 3,
  ) {
    console.log('Finding Lesson Details', courseId);

    if (!courseId) {
      throw new BadRequestException('courseId must be defined');
    }

    if (sortOrder != 'asc' && sortOrder != 'desc') {
      throw new BadRequestException('sortOrder must be asc or desc');
    }

    return this.lessonsDB.search(courseId, sortOrder, pageNumber, pageSize);
  }
}
