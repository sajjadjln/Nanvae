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
import { useState } from 'react';
import agent from '../../App/api/agent';
import useStoreContext from '../../App/context/StoreContext';
import { CurrencyFormat } from '../../App//util/util';

export default function ProductCard(props) {
  const[loading, setLoading] = useState(false);
  const {setBasket} = useStoreContext();
  function handleAddItem(productId)
  {
    setLoading(true);
    agent.basket.addItem(productId).then(basket => setBasket(basket)).catch(error => console.log(error))
      .finally(() => setLoading(false));

  }
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
        <LoadingButton loading={loading} onClick={()=> handleAddItem(props.product.id)} size="small">Add to card</LoadingButton>
        <Button component={Link} to={`/catalog/${props.product.id}`} size="small">View</Button>
      </CardActions>
    </Card>
  );
}
