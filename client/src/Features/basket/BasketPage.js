import { Typography, Grid, Button } from '@mui/material';
import BasketSummary from './BasketSummery';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../App/store/configureStore';
import BasketTable from './BasketTable';

export default function BasketPage() {

    const { basket } = useAppSelector(state => state.basket);

    // Check if basket is null or empty
    if (!basket || basket.length === 0) {
        return <Typography variant='h3'>Your basket is empty</Typography>;
    }

    // Assuming basket.items is the array to be mapped
    return (
        <>
           <BasketTable items={basket.items} />
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
