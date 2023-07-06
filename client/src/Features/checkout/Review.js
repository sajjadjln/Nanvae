import * as React from 'react';
import Typography from '@mui/material/Typography';
import BasketTable from '../basket/BasketTable';
import { Grid } from '@mui/material';
import BasketSummary from '../basket/BasketSummery';
import { useAppSelector } from '../../App/store/configureStore';

export default function Review() {
  const {basket} = useAppSelector(state => state.basket)
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      {basket &&
      <BasketTable items={basket.items} isBasket={false}/>}
            <Grid container>
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                    <BasketSummary/>
                </Grid>
            </Grid>
    </React.Fragment>
  );
}