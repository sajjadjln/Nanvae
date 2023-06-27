import ProductCard from "./ProductCard";
import Grid from '@mui/material/Grid';
import styled from '@emotion/styled';
import { useAppSelector } from '../../App/store/configureStore';
import ProductCardSkeleton from './productCardSkeleton';



const useStyles = styled((theme) => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(2),
  },
}));

export default function ProductList(props) {
  const classes = useStyles();
  const {productsLoaded} = useAppSelector((state) => state.catalog);
  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        {props.products.map((product) => (
          <Grid item xs={4} key={product.id}>
            {!productsLoaded ? (
              <ProductCardSkeleton />
            ) : (
              <ProductCard product={product} /> )}
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
