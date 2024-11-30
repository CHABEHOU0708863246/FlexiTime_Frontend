import { LeaveRequest } from "./LeaveRequest";

export interface LeavePaginationResponse {
  totalCount: number;
  leaves: LeaveRequest[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
