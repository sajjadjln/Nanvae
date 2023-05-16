import Typography from '@mui/material/Typography';
import { Button, ButtonGroup, Container } from '@mui/material';
import agent from '../../App/api/agent';
export default function AboutPage() {
    return (
        <Container>
            <Typography gutterBottom variant='h2'>Errors for testing purposes</Typography>
            <ButtonGroup>
                <Button variant='contained' onClick={()=>agent.TestErrors.get400Error().catch(error=> console.log(error))}>Test 400</Button>
                <Button variant='contained' onClick={() => agent.TestErrors.get401Error().catch(error => console.log(error))}>Test 401</Button>
                <Button variant='contained' onClick={()=>agent.TestErrors.get404Error().catch(error=> console.log(error))}>Test 404</Button>
                <Button variant='contained' onClick={()=>agent.TestErrors.get500Error().catch(error=> console.log(error))}>Test 500</Button>
                <Button variant='contained' onClick={()=>agent.TestErrors.get400ValidationError().catch(error=> console.log(error))}>Test Validation Error</Button>
            </ButtonGroup>
        </Container>
    );
}
