import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import { ListItem } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { Switch } from '@mui/material';
import { IconButton } from '@mui/material';
import { Badge } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/configureStore';
import SignedInMenu from './SignedInMenu';
const midLinks = [
  { title: 'About', path: '/about' },
  { title: 'Contact', path: '/contact' },
  { title: 'Catalog', path: '/catalog' },
];
const rightLinks = [
  { title: 'Login', path: '/login' },
  { title: 'Register', path: '/register' },
];
const navStyle = [
  {
    Typography: 'h6',
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      color: 'grey.500',
    },
    '&.active': {
      color: 'text.secondary',
    }
  }
]
export default function Header(props) {
  const { user } = useAppSelector(state => state.account);
  const { darkMode, handleThemeChange } = props;
  const { basket } = useAppSelector(state => state.basket);
  const itemCount = basket?.items.reduce((sub, item) => sub + item.quantity, 0)
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display='flex' alignItems='center'>
          <Typography variant='h6' component={NavLink} to='/' sx={navStyle}>
            Nanvae
          </Typography>
          <Switch checked={darkMode} onChange={handleThemeChange} />
        </Box>
        <List sx={{ display: 'flex' }}>
          {midLinks.map(({ title, path }) => (
            <ListItem
              component={NavLink}
              to={path}
              key={path}
              sx={navStyle}
            >
              {title.toUpperCase()}
            </ListItem>
          ))}
        </List>
        <Box display='flex' alignItems='center'>
          <IconButton component={Link} to='/basket' size='large' sx={{ color: 'inherit' }}>
            <Badge badgeContent={itemCount} color='secondary'>
              <ShoppingCart />
            </Badge>
          </IconButton>
          {user ? (
            <SignedInMenu />) :
            <List sx={{ display: 'flex' }}>
              {rightLinks.map(({ title, path }) => (
                <ListItem
                  component={NavLink}
                  to={path}
                  key={path}
                  sx={navStyle}
                >
                  {title.toUpperCase()}
                </ListItem>
              ))}
            </List>
          }

        </Box>
      </Toolbar>
    </AppBar>
  );
}
