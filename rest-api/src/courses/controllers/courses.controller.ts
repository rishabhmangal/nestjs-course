import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Course } from '../../../../shared/course';
import { CoursesRepository } from '../repositories/courses.repository';
import { HttpExceptionFilter } from '../../filters/http.filter';
import { ToIntegerPipe } from '../../pipes/to-integer.pipe';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { AdminGuard } from '../../guards/admin.guard';
//import { findAllCourses } from '../../../db-data';
@Controller('courses')
@UseGuards(AuthenticationGuard)
//@UseFilters(new HttpExceptionFilter()) //moved to main.ts to apply globally to all controllers
export class CoursesController {
  constructor(@Inject(CoursesRepository) private coursesDB) {}

  // @Get('/api/hello-world')
  // async helloWorld(): Promise<string> {
  //   return "Hello World'";
  // }

  @Get()
  // @Get('/api/courses') -- api is defined at root level under main.ts & courses at top of this controller
  //@UseGuards(AuthenticationGuard) //move to top to apply to all methods here
  async findAllCourses(): Promise<Course[]> {
    //debugger;
    //return findAllCourses(); --loads data from db-data local file
    return this.coursesDB.findAll();
  }

  @Post()
  @UseGuards(AdminGuard)
  async createCourse(@Body() course: Course): Promise<Course> {
    //replace Partial<Course> with Course for validation pipe
    console.log('Create Course', course);
    return this.coursesDB.addCourse(course);
  }

  @Get(':courseUrl')
  async findCourseByUrl(@Param('courseUrl') courseUrl: string) {
    console.log('Finding by courseUrl', courseUrl);

    const course = await this.coursesDB.findCourseByUrl(courseUrl);

    if (!course) {
      throw new NotFoundException('Could not find course for url ' + courseUrl);
    }

    return course;
  }

  @Put(':courseId')
  @UseGuards(AdminGuard)
  //@UseFilters(new HttpExceptionFilter()) //moved to top to apply for all func
  async updateCourse(
    @Param('courseId') courseId: string,
    //@Body('seqNo', ToIntegerPipe) seqNo: number, //for pipe demo, can use ParseIntPipe inbuilt
    @Body() changes: Course, //replace Partial<Course> with Course for validation pipe
  ): Promise<Course> {
    console.log('Updating Course');
    //console.log('seq No Value ' + seqNo + ' ,type:' + typeof seqNo);

    if (changes._id) {
      throw new BadRequestException("Can't update course id");
    }
    return this.coursesDB.updateCourse(courseId, changes);
  }

  @Delete(':courseId')
  @UseGuards(AdminGuard)
  async deleteCourse(@Param('courseId') courseId: string) {
    console.log('Deleting Course');

    return this.coursesDB.deleteCourse(courseId);
  }
}
