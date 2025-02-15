import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/User';
import { UsersService } from '../../../core/services/users/users.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { PublicHoliday } from '../../../core/models/PublicHoliday';
import { HolidayService } from '../../../core/services/holiday/holiday.service';

/**
 * Component pour configurer les jours fériés
 */
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
export class HolidayConfigComponent implements OnInit {
  // Liste des utilisateurs
  users: User[] = [];
  filteredUsers: User[] = [];
  displayedUsers: User[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  // États des menus
  isUserMenuOpen: boolean = false;
  isLeaveMenuOpen: boolean = false;
  isAttendanceMenuOpen: boolean = false;
  isReportMenuOpen: boolean = false;

  // Utilisateur connecté
  user: User | null = null;

  // Recherche
  searchTerm: string = '';

  // Jours fériés
  holidays: PublicHoliday[] = [];

  // Formulaire pour gérer l'ajout/modification d'un jour férié
  holidayForm!: FormGroup;
  isEdit: boolean = false; // Mode édition actif ?
  currentHolidayId: string | null = null; // ID du jour férié en cours d'édition

  constructor(
    private router: Router,
    private usersService: UsersService,
    private authService: AuthService,
    private fb: FormBuilder,
    private holidayService: HolidayService
  ) {
    this.holidayForm = this.fb.group({
      holidayName: ['', Validators.required],
      holidayDate: ['', Validators.required],
      countryCode: ['', Validators.required],
    });
  }

  /**
   * Initialiser le component
   */
  ngOnInit(): void {
    this.getUsers();
    this.getUserDetails();
    this.loadHolidays();
  }

  /**
   * Charger tous les jours fériés
   */
  loadHolidays(): void {
    this.holidayService.getAllHolidays().subscribe({
      next: (data) => (this.holidays = data),
      error: (err) => console.error('Erreur de chargement des jours fériés', err),
    });
  }

  /**
   * Soumettre le formulaire d'ajout/modification de jour férié
   */
  onSubmit(): void {
    if (this.holidayForm.invalid) return;

    const holidayData = this.holidayForm.value;

    if (this.isEdit && this.currentHolidayId) {
      // Mode édition : mettre à jour un jour férié existant
      this.holidayService.updateHoliday(this.currentHolidayId, holidayData).subscribe({
        next: () => {
          this.loadHolidays();
          this.onReset();
        },
        error: (err) => console.error('Erreur lors de la mise à jour', err),
      });
    } else {
      // Mode ajout : ajouter un nouveau jour férié
      this.holidayService.createHoliday(holidayData).subscribe({
        next: () => {
          this.loadHolidays();
          this.onReset();
        },
        error: (err) => console.error('Erreur lors de l\'ajout', err),
      });
    }
  }

  /**
   * Mettre à jour le formulaire avec les données d'un jour férié existant pour l'édition
   * @param holiday Le jour férié à éditer
   */
  onEdit(holiday: PublicHoliday): void {
    this.isEdit = true;
    this.currentHolidayId = holiday.id;
    this.holidayForm.patchValue(holiday);
  }

  /**
   * Supprimer un jour férié
   * @param id L'ID du jour férié à supprimer
   */
  onDelete(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer ce jour férié ?')) {
      this.holidayService.deleteHoliday(id).subscribe({
        next: () => this.loadHolidays(),
        error: (err) => console.error('Erreur lors de la suppression', err),
      });
    }
  }

  /**
   * Réinitialiser le formulaire et les états d'édition
   */
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
