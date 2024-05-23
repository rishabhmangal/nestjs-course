// export interface Course {
//   _id: string;
//   seqNo:number;
//   url:string;
//   iconUrl: string;
//   courseListIcon: string;
//   description: string;
//   longDescription?: string;
//   category: string;
//   lessonsCount: number;
//   promo: boolean;
// }

import { IsBoolean, IsInt, IsMongoId, IsString } from "class-validator";

export class Course {
  //changed from interface to class to support class-validator package and allow adding decorators
  @IsString()
  @IsMongoId()
  _id: string;
  @IsInt({ message: "seqNo must be numeric" }) seqNo: number;
  @IsString({ always: false }) url: string; //always property to make it optional
  @IsString() iconUrl: string;
  @IsString() courseListIcon: string;
  @IsString() description: string;
  @IsString() longDescription?: string;
  @IsString() category: string;
  @IsInt() lessonsCount: number;
  @IsBoolean() promo: boolean;
}

export function compareCourses(c1: Course, c2: Course) {
  const compare = c1.seqNo - c2.seqNo;

  if (compare > 0) {
    return 1;
  } else if (compare < 0) {
    return -1;
  } else return 0;
}
