export class PaginatedResponse {
  constructor(items, metaData) {
    this.items = items;
    this.metaData = metaData;
  }
}

export const metaData = {
  currentPage: 1,
  pageSize: 10,
  totalPages: 5,
  totalCount: 50,
};


