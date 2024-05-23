import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesController } from './controllers/courses.controller';
import { CoursesSchema } from './schemas/courses.schema';
import { CoursesRepository } from './repositories/courses.repository';
import { LessonsSchema } from './schemas/lessons.schema';
import { LessonsController } from './controllers/lessons.controller';
import { LessonsRepository } from './repositories/lessons.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Course', schema: CoursesSchema },
      { name: 'Lesson', schema: LessonsSchema },
    ]),
  ],
  controllers: [CoursesController, LessonsController],
  providers: [CoursesRepository, LessonsRepository],
})
export class CoursesModule {}
