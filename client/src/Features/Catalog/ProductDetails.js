import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Grid, Table, TableContainer, TableRow, TextField, Paper, Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import NotFound from '../../App/errors/NotFound';
import LoadingComponent from '../../App/layout/LoadingComponent';
import { LoadingButton } from '@mui/lab';
import { useMemo } from 'react';
import { useAppSelector } from '../../App/store/configureStore';
import { removeBasketItemAsync, addBasketItemAsync } from '../basket/basketSlice';
import { useAppDispatch } from '../../App/store/configureStore';
import { productSelectors } from './catalogSlice';
import { fetchProductAsync } from './catalogSlice';
export default function ProductDetails() {
  const { id } = useParams();
  const { basket,status} = useAppSelector(state=>state.basket);
  const product = useAppSelector(state => productSelectors.selectById(state, id));
  const {status : productStatus} = useAppSelector(state=>state.catalog);
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(0);

  const item = useMemo(() => basket?.items.find(item => item.productId === product?.id) ?? { quantity: 0 }, [basket, product]);

  useEffect(() => {
    if(item) {
      setQuantity(item.quantity);
    }
    if(!product) {
      dispatch(fetchProductAsync(parseInt(id)));
    }
  }, [id, item, product, dispatch]);

  function handleInputChange(event) {
    if (event.target.value >= 0) {
      setQuantity(parseInt(event.target.value));
    }
  }

  function handleUpdateCart(event) {

    if (!item || quantity > item.quantity) {
      const updatedQuantity = item ? quantity - item.quantity : quantity;
      dispatch(addBasketItemAsync({productId:product.id, quantity:updatedQuantity}))
    } else {
      const updatedQuantity = item.quantity - quantity;
      dispatch(removeBasketItemAsync({productId:product.id, quantity:updatedQuantity}))
    }
  }

  if (productStatus.includes("pending")) {
    return (
      <LoadingComponent message='Loading product...' />
    );
  }

  if (product == null) {
    return <NotFound />;
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img src={product.pictureUrl} alt={product.name} style={{ width: "100%" }} />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h3">
          <Divider sx={{ mb: 2 }} />
          {product.name}
        </Typography>
        <Typography variant="h4" color="secondary">
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Product Type</TableCell>
                <TableCell>{product.productType}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Product Brand</TableCell>
                <TableCell>{product.productBrand}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2} sx={{ marginTop: 4 }}>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              type="number"
              label="Quantity in Cart"
              fullWidth
              value={quantity}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ height: '100%' }}>
              <LoadingButton
                disabled={item.quantity === quantity || (!item && quantity === 0)}
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                loading={status.includes('pending')}
                onClick={handleUpdateCart}
                sx={{ height: '100%' }}
              >
                {item ? 'Update Cart' : 'Add to Cart'}
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
