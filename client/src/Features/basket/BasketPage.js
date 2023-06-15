import { Typography, TableContainer, Grid, Button } from '@mui/material';
import { Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Add, Delete, Remove } from '@mui/icons-material';
import useStoreContext from '../../App/context/StoreContext';
import { Box } from '@mui/system';
import agent from '../../App/api/agent';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import BasketSummary from './BasketSummery';
import { Link } from 'react-router-dom';

export default function BasketPage() {
    const { basket, setBasket, removeItem } = useStoreContext();
    const [status, setStatus] = useState({
        loadingRemove: false,
        loadingAdd: false,
    });

    function handleAddItem(productId, quantity) {
        setStatus({ ...status, loadingAdd: true });
        agent.basket
            .addItem(productId)
            .then((basket) => setBasket(basket))
            .catch((error) => console.error(error))
            .finally(() => setStatus({ ...status, loadingAdd: false }));
    }

    function handleRemoveItem(productId, quantity) {
        setStatus({ ...status, loadingRemove: true });
        agent.basket
            .removeItem(productId, quantity)
            .then(() => removeItem(productId, quantity))
            .catch((error) => console.error(error))
            .finally(() => setStatus({ ...status, loadingRemove: false }));
    }

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
                                    <LoadingButton loading={status.loading && status.name === 'rem' + item.productId} onClick={() => handleRemoveItem(item.productId, 1, 'rem' + item.productId)} color='error'><Remove /></LoadingButton>
                                    {item.quantity}
                                    <LoadingButton color='success' loading={status.name && status.loading === 'add' + item.productId} onClick={() => handleAddItem(item.productId, item.quantity, 'add' + item.productId)}><Add /></LoadingButton>
                                </TableCell>
                                <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    <LoadingButton loading={status.loading && status.name === 'rem' + item.productId} onClick={() => handleRemoveItem(item.productId, item.quantity, 'rem' + item.productId)} color='error'>
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
