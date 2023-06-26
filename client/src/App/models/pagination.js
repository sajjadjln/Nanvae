class PaginatedResponse {
    constructor(items, metaData) {
      this.items = items;
      this.metaData = metaData;
    }
  }

module.exports = PaginatedResponse;