namespace API.RequestHelpers
{
    public class PaginationParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1; // Default to 1
        private int _pageSize = 6; // Default to 6
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value; // If value is greater than MaxPageSize, set to MaxPageSize, else set to value
        }
    }
}