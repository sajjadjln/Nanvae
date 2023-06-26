import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { CurrencyFormat } from '../../App//util/util';
import { useAppDispatch } from '../../App/store/configureStore';
import { addBasketItemAsync } from '../basket/basketSlice';
import { useAppSelector } from '../../App/store/configureStore';

export default function ProductCard(props) {
  const {status} = useAppSelector(state => state.basket);
  const dispatch = useAppDispatch();

  return (
    <Card>
      <CardHeader
      avatar={
          <Avatar src="#" alt={props.product.name} sx={{bgcolor:'secondary.main'}}>
            {props.product.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={props.product.name}
        titleTypographyProps={{sx:{fontWeight: "bold" ,color: "primary.main" }}}
      />
      <CardMedia
        sx={{ height: 140, backgroundSize: "contain" ,bgcolor: "primary.light"}}
        image={props.product.pictureUrl}
        title={props.product.name}
      />
      <CardContent>
        <Typography gutterBottom color='secondary' variant='h5'>
          {CurrencyFormat(props.product.price)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.product.productBrand} / {props.product.productType}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton loading={status.includes('pending')}
        onClick={()=> dispatch(addBasketItemAsync({productId: props.product.id, quantity: 1}))}
         size="small">Add to card</LoadingButton>
        <Button component={Link} to={`/catalog/${props.product.id}`} size="small">View</Button>
      </CardActions>
    </Card>
  );
}
