import { TableContainer } from "@mui/material";
import { Paper, Table, TableRow, TableCell, TableBody } from "@mui/material";
import { CurrencyFormat } from "../../App/util/util";
import { useAppSelector } from "../../App/store/configureStore";
export default function BasketSummary({subtotal}) {
    const { basket } = useAppSelector(state => state.basket);
    if (subtotal === undefined)
        subtotal = basket?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;
    const deliveryFee = subtotal > 1000 ? 0 : 10;

    return (
        <>
            <TableContainer component={Paper} variant={'outlined'}>
                <Table sx={{ minWidth: 500 }}>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">
                                {CurrencyFormat(subtotal)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery Fee*</TableCell>
                            <TableCell align="right">{CurrencyFormat(deliveryFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">{CurrencyFormat(subtotal + deliveryFee)}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <span style={{ fontStyle: 'italic' }}>*orders over 1000 dollar are free fee</span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}