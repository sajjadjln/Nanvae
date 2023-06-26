import React from "react";
import ProductList from "./ProductList";
import { useEffect } from "react";
import LoadingComponent from "../../App/layout/LoadingComponent";
import { useAppSelector } from "../../App/store/configureStore";
import { fetchFilterAsync, fetchProductsAsync, productSelectors } from "./catalogSlice";
import { useAppDispatch } from "../../App/store/configureStore";
import { Box, Grid, Paper } from "@mui/material";
import { Pagination } from "@mui/material";
import { Typography } from "@mui/material";
import ProductSearch from "./productSearch";
import { setProductParams } from "./catalogSlice";
import RadioButtonGroup from "../../App/components/radioButtonGroup";
import { CheckBoxButtons } from '../../App/components/CheckBoxButton';


const sortOptions = [
  { value: 'name', label: 'Alphabetical' },
  { value: 'priceDesc', label: 'Price high to low' },
  { value: 'Price', label: 'Price low to high' },
];

export default function Catalog() {
  const products = useAppSelector(productSelectors.selectAll);
  const dispatch = useAppDispatch();
  const { productsLoaded, status, filtersLoaded, brands, types, productParams } = useAppSelector((state) => state.catalog);
  useEffect(() => {
    if (!productsLoaded) {
      dispatch(fetchProductsAsync());
    }
  }, [productsLoaded, dispatch]);
  useEffect(() => {
    if (!filtersLoaded) {
      dispatch((fetchFilterAsync()));
    }
  }, [dispatch, filtersLoaded])

  if (status.includes("pending")) {
    return (<LoadingComponent message="Loading products" />)
  }
  return (
    <Grid container spacing={4}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2 }}>
          <ProductSearch></ProductSearch>
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <RadioButtonGroup
            selectedValue={productParams.orderBy}
            options={sortOptions}
            onChange={(event) => {
              dispatch(setProductParams({ orderBy: event.target.value }));
            }}
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckBoxButtons
            items={brands}
            checked={productParams.brands}
            onChange={(items) => {
              dispatch(setProductParams({ brands: items }));
            }}
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckBoxButtons
            items={types}
            checked={productParams.types}
            onChange={(items) => {
              dispatch(setProductParams({ types: items }));
            }}
          />
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <ProductList products={products} />
      </Grid>
      <Grid item xs={3}></Grid>
      <Grid item xs={9}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography> displaying 1-6 item of 20 items</Typography>
          <Pagination color="secondary" size="large" count={10} page={2}></Pagination>
        </Box>
      </Grid>
    </Grid>
  );
}