import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/User';
import { UsersService } from '../../../core/services/users/users.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { PublicHoliday } from '../../../core/models/PublicHoliday';
import { HolidayService } from '../../../core/services/holiday/holiday.service';

@Component({
  selector: 'app-holiday-config',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './holiday-config.component.html',
  styleUrl: './holiday-config.component.scss'
})
export class HolidayConfigComponent implements OnInit{
users: User[] = [];
  filteredUsers: User[] = [];
  displayedUsers: User[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  isUserMenuOpen: boolean = false;
  isLeaveMenuOpen: boolean = false;
  isAttendanceMenuOpen: boolean = false;
  isReportMenuOpen: boolean = false;
  user: User | null = null;
  searchTerm: string = '';

  holidays: PublicHoliday[] = [];
  holidayForm!: FormGroup;
  isEdit: boolean = false;
  currentHolidayId: string | null = null;

  constructor(private router: Router,
    private usersService: UsersService ,
    private authService: AuthService,
    private fb: FormBuilder,
    private holidayService: HolidayService) {
      this.holidayForm = this.fb.group({
        holidayName: ['', Validators.required],
        holidayDate: ['', Validators.required],
        countryCode: ['', Validators.required],
      });
    }

  ngOnInit(): void {
    this.getUsers();
    this.getUserDetails();
    this.loadHolidays();
  }

  loadHolidays(): void {
    this.holidayService.getAllHolidays().subscribe({
      next: (data) => (this.holidays = data),
      error: (err) => console.error('Erreur de chargement des jours fériés', err),
    });
  }

  onSubmit(): void {
    if (this.holidayForm.invalid) return;

    const holidayData = this.holidayForm.value;

    if (this.isEdit && this.currentHolidayId) {
      this.holidayService.updateHoliday(this.currentHolidayId, holidayData).subscribe({
        next: () => {
          this.loadHolidays();
          this.onReset();
        },
        error: (err) => console.error('Erreur lors de la mise à jour', err),
      });
    } else {
      this.holidayService.addHoliday(holidayData).subscribe({
        next: () => {
          this.loadHolidays();
          this.onReset();
        },
        error: (err) => console.error('Erreur lors de l\'ajout', err),
      });
    }
  }

  onEdit(holiday: PublicHoliday): void {
    this.isEdit = true;
    this.currentHolidayId = holiday.id;
    this.holidayForm.patchValue(holiday);
  }

  onDelete(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer ce jour férié ?')) {
      this.holidayService.deleteHoliday(id).subscribe({
        next: () => this.loadHolidays(),
        error: (err) => console.error('Erreur lors de la suppression', err),
      });
    }
  }

  onReset(): void {
    this.isEdit = false;
    this.currentHolidayId = null;
    this.holidayForm.reset();
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

  getUserDetails(): void {
    this.user = this.authService.getCurrentUser();
  }

  getUsers(): void {
    this.usersService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.totalItems = data.length;
      },
      error: (error) => {
        console.error("Erreur lors du chargement des utilisateurs", error);
      }
    });
  }

  logout(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.authService.logout();
    }
    this.router.navigate(['/auth/login']);
  }

}
