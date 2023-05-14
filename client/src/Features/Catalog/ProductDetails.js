import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { Grid, Table, TableContainer, TableRow } from '@mui/material';
import Divider from '@mui/material/Divider';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios.get(`https://localhost:5002/api/Product/${id}`)
            .then(response => setProduct(response.data))
            .catch(error => console.log(error))
            .finally(() => setLoading(false))
    }, [id]);
    if (loading) {
        return (
            <Typography variant="h2">
                Loading...
            </Typography>
        );
    }
    if (!product) {
        return (
            <Typography variant="h2">
                Product not found
            </Typography>
        );
    }
    return (
            <Grid container spacing={6}>
                <Grid item xs={6}>
                    <img src={product.pictureUrl} alt={product.name} style={{ width: "100%" }} />
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h3">
                    <Divider sx={{mb:2}}/>
                        {product.name}
                    </Typography>
                    <Typography variant="h4" color='secondary'>
                        ${(product.price / 100).toFixed(2)}
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Description</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Product Type</TableCell>
                                    <TableCell>{product.productType}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Product Brand</TableCell>
                                    <TableCell>{product.productBrand}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Typography variant="body1">
                        {product.description}
                    </Typography>
                </Grid>
            </Grid>
        );
}
