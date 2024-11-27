export class PaginatedRequest {
  pageNumber: number = 1;
  pageSize: number = 10;
}

export class PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;

  constructor(items: T[], count: number, pageNumber: number, pageSize: number) {
      this.items = items;
      this.pageNumber = pageNumber;
      this.pageSize = pageSize;
      this.totalCount = count;
      this.totalPages = Math.ceil(count / pageSize);
  }

  get hasPreviousPage(): boolean {
      return this.pageNumber > 1;
  }

  get hasNextPage(): boolean {
      return this.pageNumber < this.totalPages;
  }
}
