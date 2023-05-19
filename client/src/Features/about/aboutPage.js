import Typography from '@mui/material/Typography';
import { Alert, AlertTitle, Button, ButtonGroup, Container, ListItemText } from '@mui/material';
import agent from '../../App/api/agent';
import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

export default function AboutPage() {
  const [validationErrors, setValidationErrors] = useState([]);

  function getValidationError() {
    agent.TestErrors.getValidationError()
      .then(() => console.log('you should not see this'))
      .catch((error) => setValidationErrors(error));
  }

  return (
    <Container>
      <Typography gutterBottom variant='h2'>Errors for testing purposes</Typography>
      <ButtonGroup>
        <Button variant='contained' onClick={() => agent.TestErrors.get400Error().catch((error) => console.log(error))}>Test 400</Button>
        <Button variant='contained' onClick={() => agent.TestErrors.get401Error().catch((error) => console.log(error))}>Test 401</Button>
        <Button variant='contained' onClick={() => agent.TestErrors.get404Error().catch((error) => console.log(error))}>Test 404</Button>
        <Button variant='contained' onClick={() => agent.TestErrors.get500Error().catch((error) => console.log(error))}>Test 500</Button>
        <Button variant='contained' onClick={getValidationError}>Test Validation Error</Button>
      </ButtonGroup>
      {validationErrors.length > 0 && ( // Modified condition to check for validationErrors length
        <Alert severity='error'>
          <AlertTitle>Validation errors</AlertTitle>
          <List>
            {validationErrors.map((error, index) => (
              <ListItem key={index}>
                <ListItemText>{error}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Alert>
      )}
    </Container>
  );
}
