import { Injectable } from '@nestjs/common';
import { Course } from '../../../../shared/course';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CoursesRepository {
  constructor(
    @InjectModel('Course')
    private courseModel: Model<Course>,
  ) {}

  async testCall() {
    console.log('Method Called');
  }
  async findAll(): Promise<Course[]> {
    return this.courseModel.find();
  }

  async findCourseByUrl(courseUrl: string): Promise<Course> {
    return this.courseModel.findOne({ url: courseUrl });
  }

  async addCourse(course: Partial<Course>): Promise<Course> {
    //return this.courseModel.create(course); //traditional way
    const newCourse = new this.courseModel(course); //inmemory maintained by Mongoose & track changes
    await newCourse.save();
    return newCourse.toObject({ versionKey: false }); //document in memory to object which can be serialized to return
  }

  updateCourse(courseId: string, changes: Partial<Course>): Promise<Course> {
    return this.courseModel.findOneAndUpdate({ _id: courseId }, changes, {
      new: true,
    });
  }

  deleteCourse(courseId: string) {
    return this.courseModel.deleteOne({ _id: courseId });
  }
}
