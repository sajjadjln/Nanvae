import { Button, Container, Divider, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <Container component={Paper} sx={{ height: 400 }}>
      <Typography gutterBottom variant='h3'>
        We could not find what you are looking for
      </Typography>
      <Divider />
      <Typography gutterBottom variant='h5'>
        Please try again later
      </Typography>
      <Button variant='contained' color='primary' component={Link} to='/Catalog'>
        Go back to shop
      </Button>
    </Container>
  );
}
