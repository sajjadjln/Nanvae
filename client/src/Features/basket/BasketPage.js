import { Typography, TableContainer, Grid, Button } from '@mui/material';
import { Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Add, Delete, Remove } from '@mui/icons-material';
import { Box } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import BasketSummary from './BasketSummery';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../App/store/configureStore';
import { removeBasketItemAsync } from '../basket/basketSlice';
import { addBasketItemAsync } from './basketSlice';

export default function BasketPage() {

    const { basket,status } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();

    console.log('BasketPage - status:', status); // Log the status value

    // Check if basket is null or empty
    if (!basket || basket.length === 0) {
        return <Typography variant='h3'>Your basket is empty</Typography>;
    }

    // Assuming basket.items is the array to be mapped
    const { items } = basket;
    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right">Subtotal</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow
                                key={item.productId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Box display='flex' alignItems='center'>
                                        <img src={`http://localhost:5002/${item.pictureUrl}`} alt='' style={{ height: 50, marginRight: 20 }} />
                                        <span>{item.name}</span>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                                <TableCell align="center">
                                    <LoadingButton loading={status === 'pendingRemoveItem' + item.productId + 'rem'}
                                    onClick={() => dispatch(removeBasketItemAsync({productId:item.productId,quantity:1,name:'rem'}))}
                                    color='error'><Remove /></LoadingButton>
                                    {item.quantity}
                                    <LoadingButton color='success' loading={status === 'pendingAddItem' + item.productId} onClick={()=> dispatch(addBasketItemAsync({productId:item.productId}))}><Add /></LoadingButton>
                                </TableCell>
                                <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    <LoadingButton loading={status === 'pendingRemoveItem' + item.productId + 'del'}
                                    onClick={() => dispatch(removeBasketItemAsync({productId:item.productId,quantity:item.quantity,name:'del'}))}
                                    color='error'>
                                        <Delete />
                                    </LoadingButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container>
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                    <BasketSummary/>
                    <Button variant='contained' component={Link} to='/checkout' size='large' fullWidth>Checkout</Button>
                </Grid>
            </Grid>
        </>

    );
}
