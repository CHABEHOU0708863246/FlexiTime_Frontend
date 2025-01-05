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
import Modal from 'bootstrap/js/dist/modal';

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
  isUserMenuOpen: boolean = false;
  isLeaveMenuOpen: boolean = false;
  isAttendanceMenuOpen: boolean = false;
  isReportMenuOpen: boolean = false;
  user: User | null = null;
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    editable: true,
    selectable: true,
    locale: 'fr',
    events: [],
    eventBackgroundColor: '',
    eventClick: this.handleEventClick.bind(this),
  };

  selectedEvent: CalendarEvent | null = null;

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
      [CalendarEventType.Famille]: 'Congé pour événements familiaux',
      [CalendarEventType.Formation]: 'Congé pour formation',
      [CalendarEventType.Militaire]: 'Congé pour service militaire',
      [CalendarEventType.SansSolde]: 'Congé sans solde',
      [CalendarEventType.Exceptionnel]: 'Congé exceptionnel',
      [CalendarEventType.ReposCompensateur]: 'Congé pour repos compensateur',
      [CalendarEventType.Anniversaire]: 'Congé pour anniversaire',
      [CalendarEventType.Civique]: 'Congé pour obligation civique',
      [CalendarEventType.DonSang]: 'Congé pour don de sang',
      [CalendarEventType.Deuil]: 'Congé pour deuil',
    };
    return eventTypes[eventType] || 'Type inconnu';
  }

  constructor(private router: Router, private authService: AuthService, private calendarService: CalendarService, private domService: DomService) {}

  ngOnInit(): void {
    this.getUserDetails();
    this.loadEvents();
  }

  ngAfterViewInit(): void {
    const doc = this.domService.getDocument();
    if (doc) {
      const modalElement = doc.getElementById('eventDetailsModal');
      if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();
      }
    }
  }

  handleEventClick(clickInfo: any): void {
    const event = clickInfo.event;
    this.selectedEvent = {
      id: event.id,
      title: event.title,
      startDate: event.startStr,
      endDate: event.endStr,
      eventType: event.extendedProps.eventType,
      translatedEventType: this.translateEventType(event.extendedProps.eventType),
      colorCode: event.backgroundColor,
      isRecurring: event.extendedProps.isRecurring || false,
      requestedBy: event.extendedProps.requestedBy,
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
        const modal = new Modal(modalElement);
        modal.show();
      }
    }
  }


  formatDate(date: string): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  loadEvents(): void {
    this.calendarService.getCalendarEvents().subscribe((events: CalendarEvent[]) => {
      const formattedEvents = events.map(event => ({
        id: event.id,
        title: event.title,
        start: event.startDate,
        end: event.endDate,
        backgroundColor: event.eventType === CalendarEventType.ApprovedLeave ? '#007bff' : '#28a745',
        extendedProps: {
          eventType: event.eventType,  // eventType doit être de type CalendarEventType
          isRecurring: event.isRecurring,
          requestedBy: event.requestedBy || 'Inconnu',  // Utilisation de requestedBy
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
