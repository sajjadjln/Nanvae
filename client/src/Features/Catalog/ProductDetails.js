import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Grid, Table, TableContainer, TableRow, TextField, Paper, Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import agent from '../../App/api/agent';
import NotFound from '../../App/errors/NotFound';
import LoadingComponent from '../../App/layout/LoadingComponent';
import useStoreContext from '../../App/context/StoreContext';
import { LoadingButton } from '@mui/lab';
import { useMemo } from 'react';

export default function ProductDetails() {
  const { id } = useParams();
  const { basket, setBasket, removeItem } = useStoreContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const item = useMemo(() => basket?.items.find(item => item.productId === product?.id) ?? { quantity: 0 }, [basket, product]);

  useEffect(() => {
    agent.catalog.details(id)
      .then(response => {
        setProduct(response);
        const item = basket?.items.find(item => item.productId === response?.id);
        if (item) {
          setQuantity(item.quantity);
        }
      })
      .catch(error => console.log(error))
      .finally(() => setLoading(false));
  }, [id, basket]);

  function handleInputChange(event) {
    if (event.target.value >= 0) {
      setQuantity(parseInt(event.target.value));
    }
  }

  function handleUpdateCart(event) {
    setSubmitting(true);
    if (!item || quantity > item.quantity) {
      const updatedQuantity = item ? quantity - item.quantity : quantity;
      agent.basket.addItem(product.id, updatedQuantity)
        .then(basket => setBasket(basket))
        .catch(error => console.log(error))
        .finally(() => setSubmitting(false));
    } else {
      const updatedQuantity = item.quantity - quantity;
      agent.basket.removeItem(product.id, updatedQuantity)
        .then(() => removeItem(product.id, updatedQuantity))
        .catch(error => console.log(error))
        .finally(() => setSubmitting(false));
    }
  }

  if (loading) {
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
                loading={submitting}
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
