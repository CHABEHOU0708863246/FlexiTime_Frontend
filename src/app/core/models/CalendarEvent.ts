export interface CalendarEvent {
  id: string;                // Identifiant de l'événement
  title: string;             // Titre de l'événement
  startDate: Date;           // Date de début de l'événement
  endDate: Date;             // Date de fin de l'événement
  eventType: CalendarEventType; // Type de l'événement (congé approuvé, jour férié, etc.)
  translatedEventType: string;  // Type traduit pour l'affichage
  isRecurring: boolean;      // Indique si l'événement est récurrent
  colorCode: string;         // Code couleur de l'événement (ex: #000000)
  requestedBy?: string;      // Nom de la personne ayant fait la demande (optionnel)
}




export enum CalendarEventType {
  ApprovedLeave = "Congé approuvé",  // Congé approuvé
  Holiday = "Jour férié",            // Jour férié
  Other = "Autre événement",         // Autres événements
  Paye = "Congé payé",               // Type de congé payé
  NonPaye = "Congé non payé",        // Type de congé non payé
  Maladie = "Congé maladie",         // Type de congé maladie
  Parental = "Congé parental",       // Type de congé parental
  Sabbatique = "Congé sabbatique",   // Type de congé sabbatique
  Famille = "Congé pour famille",    // Type de congé famille
  Formation = "Congé pour formation",// Type de congé formation
  Militaire = "Congé pour service militaire", // Service militaire
  SansSolde = "Congé sans solde",    // Congé sans solde
  Exceptionnel = "Congé exceptionnel", // Congé exceptionnel
  ReposCompensateur = "Congé pour repos compensateur", // Repos compensateur
  Anniversaire = "Congé pour anniversaire", // Anniversaire
  Civique = "Congé pour obligation civique", // Civique
  DonSang = "Congé pour don de sang",  // Don de sang
  Deuil = "Congé pour deuil",          // Deuil
}

