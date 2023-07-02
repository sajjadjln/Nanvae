import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../store/configureStore';
import { signOut } from '../../Features/account/accountSlice';
import { clearBasket } from '../../Features/basket/basketSlice';

export default function SignedInMenu() {
    const dispatch = useDispatch();
    const {user} = useAppSelector(state => state.account);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                color="inherit"
                sx={{ typography: 'h6' }}
                onClick={handleClick}
            >
                {user?.email}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My orders</MenuItem>
                <MenuItem onClick={()=> {
                    dispatch(signOut());
                    dispatch(clearBasket());
                } }>Logout</MenuItem>
            </Menu>
        </div>
    );
}

