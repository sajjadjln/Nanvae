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
export default function ProductCard(props) {
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
          ${props.product.price}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.product.productBrand} / {props.product.productType}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Add to card</Button>
        <Button component={Link} to={`/catalog/${props.product.id}`} size="small">View</Button>
      </CardActions>
    </Card>
  );
}
