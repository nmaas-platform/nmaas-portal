export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface PaginatorEvent {
  first: number; 
  rows: number;  
  sortField?: string;
  sortOrder?: number; 
  filters?: { [s: string]: any; }; 
}

export interface PrimeNgLazyLoadEvent {
  first: number; // Index of the first record on the current page (0-based)
  rows: number;  // Number of records per page
  sortField?: string; // Field name for sorting
  sortOrder?: number; // 1 for ASC, -1 for DESC, 0 for NONE
  filters?: { [s: string]: any; }; // Object with filters for individual columns
  globalFilter?: string; // Global filter value
}

export class PaginationSettings {
    public totalPages: number;
    public pageNumber: number;
    public sortField: string;
    public sortOrder: 'asc' | 'desc';
    public filters: { [key: string]: any };
    public maxItemsOnPage: number;
    public totalElements: number;
    

    constructor(totalPages: number = 1,maxItemsOnPage: number = 15, pageNumber: number = 0, sortField: string = '', sortOrder: 'asc' | 'desc' = 'asc', filters: { [key: string]: any } = {}, totalElements: number = 0) {
        this.totalElements = totalElements;
        this.maxItemsOnPage = maxItemsOnPage;
        this.pageNumber = pageNumber;
        this.sortField = sortField;
        this.sortOrder = sortOrder;
        this.filters = filters;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
    }
}