export class LeaveRequest {
  // Propriétés de l'employé
  userFirstName?: string;
  userLastName?: string;
  approvedById?: string;
  approvedByFirstName?: string;
  approvedByLastName?: string;

  // Propriétés liées à la demande de congé
  id: string;
  userId: string;
  type: TypeConge;
  startDate: Date;
  endDate: Date;
  status: StatutConges = StatutConges.Attente;
  comment: string = '';
  approvedBy?: string;
  reason?: string;
  requestedAt: Date;
  approvedAt?: Date;
  justificationFileUrl?: string;

  constructor(
    id: string,
    userId: string,
    type: TypeConge,
    startDate: Date,
    endDate: Date,
    status: StatutConges,
    comment: string,
    approvedBy: string | undefined,
    reason: string | undefined,
    requestedAt: Date,
    approvedAt?: Date,
    justificationFileUrl?: string
  ) {
    this.id = id;
    this.userId = userId;
    this.type = type;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.comment = comment;
    this.approvedBy = approvedBy;
    this.reason = reason;
    this.requestedAt = requestedAt;
    this.approvedAt = approvedAt;
    this.justificationFileUrl = justificationFileUrl;
  }

  // Méthode pour obtenir le nom complet de l'approbateur
  getApproverFullName(): string {
    if (this.approvedByFirstName && this.approvedByLastName) {
      return `${this.approvedByFirstName} ${this.approvedByLastName}`;
    }
    return '-';
  }

  // Méthode pour valider les dates de congé
  isValid(): boolean {
    return this.endDate >= this.startDate;
  }
}

// Enum pour le statut de la demande de congé
export enum StatutConges {
  Attente = 0,
  Approuve = 1,
  Rejete = 2
}

// Enum pour le type de congé
export enum TypeConge {
  Paye = 0,                 // Congé payé
  NonPaye = 1,              // Congé non payé
  Maladie = 2,              // Congé maladie
  Parental = 3,             // Congé parental
  Sabbatique = 4,           // Congé sabbatique
  Famille = 5,              // Congé pour événements familiaux (mariage, naissance, décès)
  Formation = 6,            // Congé pour formation
  Militaire = 7,            // Congé pour service militaire
  SansSolde = 8,            // Congé sans solde
  Exceptionnel = 9,        // Congé exceptionnel soumis à approbation spéciale
  ReposCompensateur = 10,   // Congé pour repos compensateur
  Anniversaire = 11,        // Congé pour anniversaire
  Civique = 12,             // Congé pour obligation civique
  DonSang = 13,             // Congé pour don de sang
  Deuil = 14                // Congé pour deuil
}

// Fonction pour afficher les informations liées à chaque type de congé
export function getLeaveDetails(type: TypeConge): string {
  switch(type) {
    case TypeConge.Paye:
      return "Congé payé - Déduit du solde de congé payé";
    case TypeConge.NonPaye:
      return "Congé non payé - Pas de déduction du solde";
    case TypeConge.Maladie:
      return "Congé maladie - Nécessite un certificat médical";
    case TypeConge.Parental:
      return "Congé parental - Selon la législation, souvent payé";
    case TypeConge.Sabbatique:
      return "Congé sabbatique - Souvent non payé, accord spécifique nécessaire";
    case TypeConge.Famille:
      return "Congé pour événements familiaux - Mariage, naissance, décès, etc.";
    case TypeConge.Formation:
      return "Congé pour formation - Peut être rémunéré selon les accords";
    case TypeConge.Militaire:
      return "Congé pour service militaire - Selon la législation";
    case TypeConge.SansSolde:
      return "Congé sans solde - Non payé";
    case TypeConge.Exceptionnel:
      return "Congé exceptionnel - Soumis à une approbation spéciale";
    case TypeConge.ReposCompensateur:
      return "Congé pour repos compensateur - Compensation pour heures supplémentaires";
    case TypeConge.Anniversaire:
      return "Congé pour anniversaire - Souvent offert comme avantage";
    case TypeConge.Civique:
      return "Congé pour obligation civique - Protégé par la loi (juré, élection, etc.)";
    case TypeConge.DonSang:
      return "Congé pour don de sang - Accordé pour participation à un don";
    case TypeConge.Deuil:
      return "Congé pour deuil - Accordé pour la perte d'un proche";
    default:
      return "Type de congé inconnu";
  }
}
