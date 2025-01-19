import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/User';
import { AuthService } from '../../../core/services/auth/auth.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarService } from '../../../core/services/calendar/calendar.service';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarEvent, CalendarEventType } from '../../../core/models/CalendarEvent';
import { DomService } from '../../../shared/dom.service';

@Component({
  selector: 'app-leave-calendar-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    FullCalendarModule
  ],
  templateUrl: './leave-calendar-view.component.html',
  styleUrl: './leave-calendar-view.component.scss'
})
export class LeaveCalendarViewComponent implements OnInit, AfterViewInit {
  // États des menus
  isUserMenuOpen: boolean = false;
  isLeaveMenuOpen: boolean = false;
  isAttendanceMenuOpen: boolean = false;
  isReportMenuOpen: boolean = false;

  // Utilisateur connecté
  user: User | null = null;

  // Options du calendrier
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    editable: true,
    selectable: true,
    locale: 'fr',
    events: [],
    eventBackgroundColor: '',
    eventClick: this.handleEventClick.bind(this),
    // Modification 1: Traduction du titre des événements en français
    eventContent: (arg: any) => {
      const eventTitle = this.translateEventTitle(arg.event.title);
      return { html: `<div class="fc-content">${eventTitle}</div>` };
    }
  };


   /**
   * Traduire le titre de l'événement
   * @param title Titre de l'événement en anglais
   * @returns Titre traduit en français
   */
   translateEventTitle(title: string): string {
    const translations: { [key: string]: string } = {
      'Leave': 'Congé',
      'Vacation': 'Vacances',
      'Sick Leave': 'Congé Maladie',
      // Ajoutez d'autres traductions selon vos besoins
    };
    return translations[title] || title;
  }

  // Événement sélectionné
  selectedEvent: CalendarEvent | null = null;

  /**
   * Traduire le type d'événement en chaîne
   * @param eventType Type de l'événement à traduire
   * @returns Chaîne traduite du type d'événement ou "Type inconnu" si pas trouvé
   */
  translateEventType(eventType: CalendarEventType): string {
    const eventTypes: { [key in CalendarEventType]: string } = {
      [CalendarEventType.ApprovedLeave]: 'Congé approuvé',
      [CalendarEventType.Holiday]: 'Jour férié',
      [CalendarEventType.Other]: 'Autre événement',
      [CalendarEventType.Paye]: 'Congé payé',
      [CalendarEventType.NonPaye]: 'Congé non payé',
      [CalendarEventType.Maladie]: 'Congé maladie',
      [CalendarEventType.Parental]: 'Congé parental',
      [CalendarEventType.Sabbatique]: 'Congé sabbatique',
      [CalendarEventType.Famille]: 'Congé familial',
      [CalendarEventType.Formation]: 'Congé formation',
      [CalendarEventType.Militaire]: 'Congé militaire',
      [CalendarEventType.SansSolde]: 'Congé sans solde',
      [CalendarEventType.Exceptionnel]: 'Congé exceptionnel',
      [CalendarEventType.ReposCompensateur]: 'Repos compensateur',
      [CalendarEventType.Anniversaire]: 'Anniversaire',
      [CalendarEventType.Civique]: 'Jour civique',
      [CalendarEventType.DonSang]: 'Don de sang',
      [CalendarEventType.Deuil]: 'Congé de deuil',
    };
    return eventTypes[eventType] || `Type ${eventType}`;
  }


  constructor(
    private router: Router,
    private authService: AuthService,
    private calendarService: CalendarService,
    private domService: DomService
  ) {}

  /**
   * Initialiser le component
   */
  ngOnInit(): void {
    this.getUserDetails();
    this.loadEvents();
  }

  /**
   * Méthode appelée après la vue initiale
   */
  ngAfterViewInit(): void {
    if (this.isClientSide()) {
      import('bootstrap/js/dist/modal').then(({ default: Modal }) => {
        const doc = this.domService.getDocument();
        if (doc) {
          const modalElement = doc.getElementById('eventDetailsModal');
          if (modalElement) {
            const modal = new Modal(modalElement);
            modal.show();
          }
        }
      });
    }
  }

  /**
   * Gérer le clic sur un événement du calendrier
   * @param clickInfo Informations sur le clic de l'événement
   */
  handleEventClick(clickInfo: any): void {
    const event = clickInfo.event;
    // Modification 3: Assurer que le nom du demandeur est toujours affiché
    this.selectedEvent = {
      id: event.id,
      title: this.translateEventTitle(event.title),
      startDate: event.startStr,
      endDate: event.endStr,
      eventType: event.extendedProps.eventType,
      translatedEventType: this.translateEventType(event.extendedProps.eventType),
      colorCode: event.backgroundColor,
      isRecurring: event.extendedProps.isRecurring || false,
      requestedBy: event.extendedProps.requestedBy || this.user?.lastName || 'Non spécifié',
    };

    if (this.isClientSide()) {
      this.showEventDetailsModal();
    }
  }

  /**
   * Vérifier si l'environnement est côté client
   * @returns true si c'est un environnement côté client, false sinon
   */
  isClientSide(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  /**
   * Afficher les détails d'un événement dans un modal
   */
  showEventDetailsModal(): void {
    if (this.isClientSide()) {
      const modalElement = document.getElementById('eventDetailsModal');
      if (modalElement) {
        import('bootstrap/js/dist/modal').then(({ default: Modal }) => {
          const modal = new Modal(modalElement);
          modal.show();
        }).catch(err => {
          console.error('Erreur lors du chargement du module Bootstrap Modal:', err);
        });
      }
    }
  }

  /**
   * Formater une date au format français (jj/mm/aaaa)
   * @param date Date à formater
   * @returns Chaîne formatée de la date
   */
  formatDate(date: string): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Charger les événements du calendrier
   */
  loadEvents(): void {
    this.calendarService.getCalendarEvents().subscribe((events: CalendarEvent[]) => {
      const formattedEvents = events.map(event => ({
        id: event.id,
        title: this.translateEventTitle(event.title),
        start: event.startDate,
        end: event.endDate,
        backgroundColor: event.eventType === CalendarEventType.ApprovedLeave ? '#007bff' : '#28a745',
        extendedProps: {
          eventType: event.eventType,
          isRecurring: event.isRecurring,
          requestedBy: event.requestedBy || 'Non spécifié', // Nom du demandeur
        },
      }));

      this.calendarOptions.events = formattedEvents;
    });
  }




  getUserDetails(): void {
    this.user = this.authService.getCurrentUser();
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
