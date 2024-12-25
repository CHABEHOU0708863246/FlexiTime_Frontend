export interface LeaveBalance {
  id: string;
  userId: string;

  // Soldes de congés
  paidLeaveBalance: number;
  unpaidLeaveBalance: number;
  sickLeaveBalance: number;
  parentalLeaveBalance: number;
  sabbaticalLeaveBalance: number;
  familyEventLeaveBalance: number;
  trainingLeaveBalance: number;
  militaryServiceLeaveBalance: number;
  exceptionalLeaveBalance: number;
  compensatoryLeaveBalance: number;
  birthdayLeaveBalance: number;
  civicDutyLeaveBalance: number;
  bereavementLeaveBalance: number;
  otherLeaveBalance: number;

  // Jours de congé utilisés par type
  usedLeave: number;
  usedUnpaidLeave: number;
  usedSickLeave: number;
  usedParentalLeave: number;
  usedSabbaticalLeave: number;
  usedFamilyEventLeave: number;
  usedTrainingLeave: number;
  usedMilitaryServiceLeave: number;
  usedExceptionalLeave: number;
  usedCompensatoryLeave: number;
  usedBirthdayLeave: number;
  usedCivicDutyLeave: number;
  usedBereavementLeave: number;
  usedOtherLeave: number;

  remainingBalance: number;

  // Suivi des congés utilisés par type
  usedLeaveByType: Record<string, number>;
  updatedAt: Date;
  createdAt: Date;
}
