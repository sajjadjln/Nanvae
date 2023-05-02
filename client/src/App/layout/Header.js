import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Brightness4, Brightness7 } from '@mui/icons-material';

export default function Header(props) {
  const { darkMode, handleThemeChange } = props;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{mb: 4}}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Nanvae
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ToggleButtonGroup value={darkMode} exclusive onChange={handleThemeChange}>
              <ToggleButton value={false}>
                <Brightness7 />
              </ToggleButton>
              <ToggleButton value={true}>
                <Brightness4 />
              </ToggleButton>
            </ToggleButtonGroup>
            <Button color="inherit" sx={{ marginLeft: 2 }}>Login</Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
