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
import frLocale from '@fullcalendar/core/locales/fr';

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
    locale: frLocale,
    events: [],
    eventBackgroundColor: '',
    eventClick: this.handleEventClick.bind(this),
    eventContent: (arg: any) => {
      const eventTitle = this.translateEventTitle(arg.event.title);
      const requestedBy = arg.event.extendedProps.requestedBy || 'Non spécifié';
      return {
        html: `<div class="fc-content">
                <strong>${eventTitle}</strong><br>
                <small>Demandé par : ${requestedBy}</small>
              </div>`
      };
    },
    headerToolbar: {
      start: 'prev,next today',
      center: 'title',
      end: 'dayGridMonth,dayGridWeek,dayGridDay'
    }
  };

  // Événement sélectionné
  selectedEvent: CalendarEvent | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private calendarService: CalendarService,
    private domService: DomService
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
    this.loadEvents();
  }

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

  handleEventClick(clickInfo: any): void {
    const event = clickInfo.event;
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
      requesterName: event.extendedProps.requesterName || 'Nom non spécifié', // Ajout de requesterName
    };

    if (this.isClientSide()) {
      this.showEventDetailsModal();
    }
  }

  isClientSide(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

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

  formatDate(date: string): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

// Dans votre composant
loadEvents(): void {
  this.calendarService.getCalendarEvents().subscribe({
    next: (events: CalendarEvent[]) => {
      const formattedEvents = events.map(event => {
        // Utiliser directement la date de fin sans ajouter de jour
        return {
          id: event.id,
          title: event.title.startsWith('Paid')
            ? `Congé payé - ${event.requesterName}`
            : event.title,
          start: event.startDate,
          end: event.endDate,  // Utiliser la date de fin telle quelle
          backgroundColor: event.colorCode || '#007bff',
          extendedProps: {
            eventType: event.eventType,
            isRecurring: event.isRecurring,
            requestedBy: event.requesterName || 'Non spécifié',
            translatedEventType: this.translateEventType(event.eventType)
          }
        };
      });

      this.calendarOptions.events = formattedEvents;
    },
    error: (error) => {
      console.error('Erreur lors du chargement des événements:', error);
    }
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

  translateEventTitle(title: string): string {
    const translations: { [key: string]: string } = {
      'Leave': 'Congé',
      'Vacation': 'Vacances',
      'Sick Leave': 'Congé Maladie',
      // Ajoutez d'autres traductions selon vos besoins
    };
    return translations[title] || title;
  }

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
}
