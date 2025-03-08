import { Routes } from '@angular/router';
import { RegisterComponent } from '../components/register/register.component';
import { LoginComponent } from '../components/login/login.component';
import { LogoutComponent } from '../components/logout/logout.component';
import { AllCoursesComponent } from '../components/all-courses/all-courses.component';
import { CourseDetailsComponent } from '../components/course-details/course-details.component';
import { AddCourseComponent } from '../components/add-course/add-course.component';

export const routes: Routes = [
    {path: "auth/register", component: RegisterComponent},
    {path: "auth/login", component: LoginComponent},
    {path: "user/logout", component: LogoutComponent},
    {path: "course/allCourses", component: AllCoursesComponent},
    {path: "course/details", component: CourseDetailsComponent},
    {path: "course/edit", component:AddCourseComponent},
    {path: "course/add", component:AddCourseComponent},
];
