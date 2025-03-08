import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { CourseService } from '../services/courses.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    CommonModule,
    HttpClientModule
  ],
  providers: [UserService, CourseService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CoursesOnline';
}
