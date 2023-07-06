import { Table,TableContainer, TableHead, TableRow, TableCell, TableBody, Button, Paper } from '@mui/material';
import OrderDetail from './orderDetail';
import { useEffect, useState } from 'react';
import agent from '../../App/api/agent';
import LoadingComponent from '../../App/layout/LoadingComponent';
import { CurrencyFormat } from '../../App/util/util';
export default function Order()
{
    const [orders,setOrders] = useState(null);
    const [loading,setLoading] = useState(true);
    const [selectedOrderNumber,setSelectedOrder] = useState(0);

    useEffect(()=>{
        agent.orders.list()
            .then(orders => setOrders(orders))
            .catch(error=>console.log(error))
            .finally(()=>{
                setLoading(false);
        })
    },[])
    if (loading) return <LoadingComponent message='loading orders ...'/>
    if (selectedOrderNumber > 0)
        return <OrderDetail order={orders?.find(order => order.id === selectedOrderNumber)} setSelectedOrder={setSelectedOrder}/>;
    return(
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>order number</TableCell>
            <TableCell align="right">total</TableCell>
            <TableCell align="right">order date</TableCell>
            <TableCell align="right">order status</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders?.map((order) => (
            <TableRow
              key={order.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {order.id}
              </TableCell>
              <TableCell align="right">{CurrencyFormat(order.total)}</TableCell>
              <TableCell align="right">{order.orderDate.split('T')[0]}</TableCell>
              <TableCell align="right">{order.orderStatus}</TableCell>
              <TableCell align="right">
                <Button onClick={()=>setSelectedOrder(order.id)}>view</Button>
            </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    )
}