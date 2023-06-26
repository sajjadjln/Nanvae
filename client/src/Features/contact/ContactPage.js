import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '../../App/store/configureStore';
import { ButtonGroup , Button } from '@mui/material';
import { decrement, increment } from './counterSlice';

export default function ContactPage() {
    const dispatch = useAppDispatch();
    const { data, title } = useAppSelector((state) => state.counter);
    return (
        <>
            <Typography variant='h2'>
                {title}
            </Typography>
            <Typography variant='h5'>
                the data is {data}
            </Typography>
            <ButtonGroup>
                <Button onClick={() => dispatch(decrement(1))} variant='contained' color='error'>-</Button>
                <Button onClick={() => dispatch(increment(1))} variant='contained' color='success'>+</Button>
            </ButtonGroup>
        </>
    );
}
