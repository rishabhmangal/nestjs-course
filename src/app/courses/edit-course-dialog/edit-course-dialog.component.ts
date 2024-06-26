import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../../../../shared/course";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { CoursesHttpService } from "../services/courses-http.service";

@Component({
  selector: "course-dialog",
  templateUrl: "./edit-course-dialog.component.html",
  styleUrls: ["./edit-course-dialog.component.css"],
})
export class EditCourseDialogComponent {
  form: FormGroup;

  dialogTitle: string;

  course: Course;

  mode: "create" | "update";

  loading$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditCourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private coursesService: CoursesHttpService
  ) {
    //console.log("Edit Dialog called");
    this.dialogTitle = data.dialogTitle;
    this.course = data.course;
    this.mode = data.mode;

    const formControls = {
      description: ["", Validators.required],
      category: ["", Validators.required],
      longDescription: ["", Validators.required],
      promo: [false, []],
    };

    if (this.mode == "update") {
      this.form = this.fb.group(formControls);
      this.form.patchValue({ ...data.course });
    } else if (this.mode == "create") {
      this.form = this.fb.group({
        ...formControls,
        url: ["", Validators.required],
        iconUrl: ["", Validators.required],
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    const changes: Partial<Course> = {
      ...this.form.value,
    };
    //changes._id = "2"; //to simulate exception throw from update course in API coursecontroller
    if (this.mode == "update") {
      console.log("Update course: ", changes);

      this.coursesService
        .updateCourse(this.course._id, changes)
        .subscribe((course) => this.dialogRef.close(course));
    } else if (this.mode == "create") {
      console.log("Create course: ", changes);
      this.coursesService
        .createCourse(changes)
        .subscribe((course) => this.dialogRef.close(course));
    }
  }
}
