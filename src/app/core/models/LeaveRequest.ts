export class LeaveRequest {

  userFirstName?: string;
  userLastName?: string;
  approvedById?: string;
  approvedByFirstName?: string;
  approvedByLastName?: string;

  id: string;
  userId: string;
  type: TypeConge = TypeConge.Paye;
  startDate: Date;
  endDate: Date;
  status: StatutConges = StatutConges.Attente;
  comment: string = '';
  approvedBy?: string;
  reason?: string;
  requestedAt: Date;
  approvedAt?: Date;

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
    approvedAt?: Date
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
  }

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
  Rejete = 2,
  Annule = 3
}

// Enum pour le type de congé
export enum TypeConge {
  Paye = 0,
  NonPaye = 1,
  Maladie = 2,
  Parental = 3,
  Autre = 4
}
