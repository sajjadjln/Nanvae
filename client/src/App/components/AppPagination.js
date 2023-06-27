import { Box } from '@mui/material';
import { Typography } from '@mui/material'
import { Pagination } from '@mui/material';

export default function AppPagination({ metaData, onPageChange }) {
    if (!metaData) {
      return null; // Return null or any fallback UI when metaData is null
    }

    const { currentPage, totalPages, totalCount, pageSize } = metaData;

    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography>
          displaying {(currentPage - 1) * pageSize + 1}-
          {currentPage * pageSize > totalCount ? totalCount : currentPage * pageSize} of {totalCount} items
        </Typography>
        <Pagination
          color="secondary"
          size="large"
          count={totalPages}
          page={currentPage}
          onChange={(e, page) => onPageChange(page)}
        />
      </Box>
    );
  }
