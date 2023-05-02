import ProductCard from "./ProductCard"
import { Grid } from '@mui/material';

export default function ProductList(props) {
  return (
    <Grid container spacing={4}>
      {props.products.map((product) => (
        <Grid item xs={3} key={product.id}>
          <ProductCard  product={product} />
        </Grid>
      ))}
    </Grid>
  )
}