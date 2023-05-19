import { Container, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function ServerError() {
  return (
    <Container component={Paper} sx={styles.container}>
      <Typography variant='h2' gutterBottom sx={styles.heading} color="red">
        Server Error
      </Typography>
      <Typography gutterBottom variant='body1' sx={styles.body}>
        Something went wrong on our end. Please try again later.
      </Typography>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Button variant='contained' color='primary' sx={styles.button}>
          Return to Home Page
        </Button>
      </Link>
    </Container>
  );
}

const styles = {
  container: {
    padding: '24px',
    maxWidth: '600px',
    margin: 'auto',
  },
  heading: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  body: {
    fontSize: '18px',
    marginBottom: '24px',
  },
  button: {
    fontSize: '16px',
    padding: '12px 24px',
  },
};
