export interface Report {
  id: string;
  reportType: ReportType;
  generatedAt: Date;
  generatedBy: string;
  data: string[];
  createdDate: Date;
  updatedDate?: Date;
  generatedByName?: string;
}

export enum ReportType {
  ApprovedLeaves = "ApprovedLeaves",
  PendingLeaves = "PendingLeaves",
  UserActivity = "UserActivity",
  CustomReport = "CustomReport"
}
