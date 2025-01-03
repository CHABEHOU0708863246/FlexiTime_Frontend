import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '../../core/models/User';
import { LeaveStatusSummary } from '../../core/models/LeaveStatusSummary';
import { LeaveReportsService } from '../../core/services/leaveReports/leave-reports.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  isUserMenuOpen: boolean = false;
  isLeaveMenuOpen: boolean = false;
  isAttendanceMenuOpen: boolean = false;
  isReportMenuOpen: boolean = false;
  user: User | null = null;
  leaveStatistics: LeaveStatusSummary | null = null;


  constructor(private router: Router, private authService: AuthService, private leaveReportsService: LeaveReportsService) {}

  ngOnInit(): void {
    this.getUserDetails();
    this.loadLeaveStatistics();
  }

  getUserDetails(): void {
    this.user = this.authService.getCurrentUser();
  }

  loadLeaveStatistics(): void {
    this.leaveReportsService.getLeaveStatusSummary().subscribe(
      (data) => {
        this.leaveStatistics = data;  // Stocke les données reçues
      },
      (error) => {
        console.error('Erreur lors de la récupération des statistiques des congés:', error);
      }
    );
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleLeaveMenu() {
    this.isLeaveMenuOpen = !this.isLeaveMenuOpen;
  }

  toggleReportMenu() {
    this.isReportMenuOpen = !this.isReportMenuOpen;
  }

  logout(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.authService.logout();
    }
    this.router.navigate(['/auth/login']);
  }
}
