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
  const { darkMode, handleThemeChange } = props;

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
          <IconButton size='large' sx={{ color: 'inherit' }}>
            <Badge badgeContent={4} color='secondary'>
              <ShoppingCart />
            </Badge>
          </IconButton>
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
        </Box>
      </Toolbar>
    </AppBar>
  );
}
