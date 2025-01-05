export enum AttendanceStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled'
}

export class Attendance {
  id: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: AttendanceStatus;
  employeeName?: string;

  constructor(
      id: string,
      employeeId: string,
      startDate: Date,
      endDate: Date,
      reason: string,
      status: AttendanceStatus = AttendanceStatus.Pending
  ) {
      this.id = id;
      this.employeeId = employeeId;
      this.startDate = startDate;
      this.endDate = endDate;
      this.reason = reason;
      this.status = status;
  }

  // Valide que la période de présence est logiquement correcte
  isValid(): boolean {
      return this.endDate >= this.startDate && this.getDurationInDays() <= 365;
  }

  // Vérifie si la participation est actuellement active
  isCurrentlyActive(): boolean {
      const now = new Date();
      return this.status === AttendanceStatus.Approved && now >= this.startDate && now <= this.endDate;
  }

  // Calcule la durée de la fréquentation en jours
  getDurationInDays(): number {
      return (this.endDate.getTime() - this.startDate.getTime()) / (1000 * 3600 * 24) + 1; // Convert milliseconds to days
  }
}


export class AttendanceResponse {
  succeeded: boolean;
  errors: ErrorDetail[];
  attendance?: Attendance;

  constructor(succeeded: boolean, attendance?: Attendance, errors?: ErrorDetail[]) {
      this.succeeded = succeeded;
      this.attendance = attendance;
      this.errors = errors || [];
  }
}

export class ErrorDetail {
  code: string;
  message: string;

  constructor(code: string, message: string) {
      this.code = code;
      this.message = message;
  }
}
