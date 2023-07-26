import { Box } from '@mui/material';
import { Typography } from '@mui/material'
import { Pagination } from '@mui/material';
import { useState } from 'react';

export default function AppPagination({ metaData, onPageChange }) {
    if (!metaData) {
      return null; // Return null or any fallback UI when metaData is null
    }

    const { currentPage, totalPages, totalCount, pageSize } = metaData;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [pageNumber,setPageNumber] = useState(currentPage);

    function handlePageChange(page){
        setPageNumber(page);
        onPageChange(page);
    }

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
          page={pageNumber}
          onChange={(e, page) => handlePageChange(page)}
        />
      </Box>
    );
  }
