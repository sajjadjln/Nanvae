import { Box, Typography } from '@mui/material';
import Slider from 'react-slick';
export default function HomePage() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <>
        <Slider {...settings}>
            <div>
                <img src='https://res.cloudinary.com/dc59rq5mq/image/upload/v1691759448/hero1_h3hcdh.jpg' alt='bakery1' style={{display:'block',width:'100%',maxHeight:500}}></img>
            </div>
            <div>
                <img src='https://res.cloudinary.com/dc59rq5mq/image/upload/v1691759623/hero2_lhxm9j.jpg' alt='bakery2' style={{display:'block',width:'100%',maxHeight:500}}></img>
            </div>
        </Slider>
        <Box display='flex' justifyContent='center' sx={{ p: 4 }} >
        <Typography variant='h1'>
            Welcome to the store!
        </Typography>
    </Box>
    </>
    );
}

