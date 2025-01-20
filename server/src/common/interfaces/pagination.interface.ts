export interface IPaginationOptions {
    page?: number;
    limit?: number;
    orderBy?: string;
    order?: 'asc' | 'desc';
  }
  
  export interface IPaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }