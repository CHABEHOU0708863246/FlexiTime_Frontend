import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../core/models/User';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UsersService } from '../../../core/services/users/users.service';
import { Attendance } from '../../../core/models/Attendance';
import { AttendanceService } from '../../../core/services/attendance/attendance.service';


@Component({
  selector: 'app-attendance-follow-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './attendance-follow-up.component.html',
  styleUrl: './attendance-follow-up.component.scss'
})


export class AttendanceFollowUpComponent implements OnInit{
  isUserMenuOpen: boolean = false;
  isLeaveMenuOpen: boolean = false;
  isAttendanceMenuOpen: boolean = false;
  isReportMenuOpen: boolean = false;
  user: User | null = null;
  users: User[] = [];
  filteredUsers: User[] = [];

  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  attendances: Attendance[] = []; // Remplir avec vos données
  filteredAttendances: Attendance[] = this.attendances;



  constructor(
    private router: Router,
    private authService: AuthService,
    private attendanceService: AttendanceService,
    private usersService : UsersService) {}

  ngOnInit(): void {
    this.getUsers();
    this.getUserDetails();
    this.loadAttendances();
  }

  loadAttendances(): void {
    this.attendanceService.getAllAttendances().subscribe(
      (data) => {
        this.attendances = data.map(attendance => {
          const user = this.users.find(u => u.id === attendance.employeeId);
          return new Attendance(
            attendance.id,
            attendance.employeeId,
            attendance.startDate,
            attendance.endDate,
            attendance.reason,
            attendance.status
          );
        });

        // Ajout du nom de l'employé après l'instanciation
        this.attendances.forEach(att => {
          const user = this.users.find(u => u.id === att.employeeId);
          att.employeeName = user ? `${user.firstName} ${user.lastName}` : 'Utilisateur inconnu';
        });
      },
      (error) => console.error('Erreur lors de la récupération des absences :', error)
    );
  }



  getUserDetails(): void {
    this.user = this.authService.getCurrentUser();
  }

  getUsers(): void {
    this.usersService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
        this.filteredUsers = data;
      },
      (error) => {
        console.error("Erreur lors du chargement des utilisateurs", error);
      }
    );
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleLeaveMenu() {
    this.isLeaveMenuOpen = !this.isLeaveMenuOpen;
  }

  toggleAttendanceMenu() {
    this.isAttendanceMenuOpen = !this.isAttendanceMenuOpen;
  }

  toggleReportMenu() {
    this.isReportMenuOpen = !this.isReportMenuOpen;
  }

  filterAttendances() {
    this.filteredAttendances = this.attendances.filter(att =>
      att.employeeId.includes(this.searchTerm) || att.reason.includes(this.searchTerm)
    );
  }



  logout(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.authService.logout();
    }
    this.router.navigate(['/auth/login']);
  }
}
