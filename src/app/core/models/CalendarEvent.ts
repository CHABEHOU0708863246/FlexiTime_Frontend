export interface CalendarEvent {
  id: string;                // Identifiant de l'événement
  title: string;             // Titre de l'événement
  startDate: Date;           // Date de début de l'événement
  endDate: Date;             // Date de fin de l'événement
  eventType: CalendarEventType; // Type de l'événement (congé approuvé, jour férié, etc.)
  requesterName : string;
  translatedEventType?: string;  // Type traduit pour l'affichage
  isRecurring: boolean;      // Indique si l'événement est récurrent
  colorCode: string;         // Code couleur de l'événement (ex: #000000)
  requestedBy?: string;      // Nom de la personne ayant fait la demande (optionnel)
}

export enum CalendarEventType {
  ApprovedLeave = "ApprovedLeave",
  Holiday = "Holiday",
  Other = "Other",
  Paye = "Paye",
  NonPaye = "NonPaye",
  Maladie = "Maladie",
  Parental = "Parental",
  Sabbatique = "Sabbatique",
  Famille = "Famille",
  Formation = "Formation",
  Militaire = "Militaire",
  SansSolde = "SansSolde",
  Exceptionnel = "Exceptionnel",
  ReposCompensateur = "ReposCompensateur",
  Anniversaire = "Anniversaire",
  Civique = "Civique",
  DonSang = "DonSang",
  Deuil = "Deuil",
}

// Dictionnaire pour la traduction des types d'événements en français
const eventTypeTranslations: Record<CalendarEventType, string> = {
  [CalendarEventType.ApprovedLeave]: "Congé approuvé",
  [CalendarEventType.Holiday]: "Jour férié",
  [CalendarEventType.Other]: "Autre événement",
  [CalendarEventType.Paye]: "Congé payé",
  [CalendarEventType.NonPaye]: "Congé non payé",
  [CalendarEventType.Maladie]: "Congé maladie",
  [CalendarEventType.Parental]: "Congé parental",
  [CalendarEventType.Sabbatique]: "Congé sabbatique",
  [CalendarEventType.Famille]: "Congé pour famille",
  [CalendarEventType.Formation]: "Congé pour formation",
  [CalendarEventType.Militaire]: "Congé pour service militaire",
  [CalendarEventType.SansSolde]: "Congé sans solde",
  [CalendarEventType.Exceptionnel]: "Congé exceptionnel",
  [CalendarEventType.ReposCompensateur]: "Congé pour repos compensateur",
  [CalendarEventType.Anniversaire]: "Congé pour anniversaire",
  [CalendarEventType.Civique]: "Congé pour obligation civique",
  [CalendarEventType.DonSang]: "Congé pour don de sang",
  [CalendarEventType.Deuil]: "Congé pour deuil",
};

// Fonction pour initialiser un événement avec une traduction
export function createCalendarEvent(event: CalendarEvent): CalendarEvent {
  return {
    ...event,
    translatedEventType: eventTypeTranslations[event.eventType] || "Type inconnu",
  };
}
