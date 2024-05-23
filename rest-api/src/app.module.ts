import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesModule } from './courses/courses.module';
import { MONGO_CONNECTION } from './constants';
import { AuthModule } from './auth/auth.module';
import { GetUserMiddleware } from './middleware/get-user.middleware';
import { CoursesController } from './courses/controllers/courses.controller';
import { LessonsController } from './courses/controllers/lessons.controller';

@Module({
  imports: [
    CoursesModule,
    AuthModule,
    MongooseModule.forRoot(MONGO_CONNECTION),
  ],
})
export class AppModule implements NestModule {
  //add nest module to implement get user middleware
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GetUserMiddleware)
      .forRoutes(CoursesController, LessonsController);
  }
}
