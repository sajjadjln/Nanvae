import { TableContainer } from '@mui/material';
import { Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Add, Delete, Remove } from '@mui/icons-material';
import { Box } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { useAppSelector, useAppDispatch } from '../../App/store/configureStore';
import { removeBasketItemAsync } from '../basket/basketSlice';
import { addBasketItemAsync } from './basketSlice';

export default function BasketTable({ items, isBasket = true }) {
    const { status } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        {isBasket &&
                            <TableCell align="right"></TableCell>}
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
                                {isBasket &&
                                    <LoadingButton loading={status === 'pendingRemoveItem' + item.productId + 'rem'}
                                        onClick={() => dispatch(removeBasketItemAsync({ productId: item.productId, quantity: 1, name: 'rem' }))}
                                        color='error'><Remove /></LoadingButton>}
                                {item.quantity}
                                {isBasket &&
                                    <LoadingButton color='success' loading={status === 'pendingAddItem' + item.productId} onClick={() => dispatch(addBasketItemAsync({ productId: item.productId }))}><Add /></LoadingButton>}
                            </TableCell>
                            <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                            {isBasket &&
                                <TableCell align="right">
                                    <LoadingButton loading={status === 'pendingRemoveItem' + item.productId + 'del'}
                                        onClick={() => dispatch(removeBasketItemAsync({ productId: item.productId, quantity: item.quantity, name: 'del' }))}
                                        color='error'>
                                        <Delete />
                                    </LoadingButton>
                                </TableCell>}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
