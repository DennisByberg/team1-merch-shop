import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoginIcon from '@mui/icons-material/Login';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { motion } from 'framer-motion';
import { useState } from 'react';
import LINKS_DATA from '../data/linksData';
import logoPNG from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Container, SxProps, Theme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useIsTopScroll } from '../hooks/useIsTopScroll';
import { useCart } from '../hooks/useCart';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isTop = useIsTopScroll();
  const { getTotalProductCount } = useCart();
  const navigate = useNavigate();

  const drawer = (
    <Box onClick={() => setMobileOpen((prevState) => !prevState)}>
      <Divider />
      <List>
        {LINKS_DATA.map((link) => (
          <ListItem key={link.name} disablePadding>
            <ListItemButton component={Link} to={link.hash} sx={{ textAlign: 'center' }}>
              <ListItemText primary={link.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        component={motion.nav}
        initial={{ y: -200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        sx={isTop ? HEADER_APP_BAR_STYLE_TOP : HEADER_APP_BAR_STYLE}
      >
        <Container maxWidth={'lg'} disableGutters>
          <Toolbar sx={{ pl: 0, pt: 1 }}>
            {/* Hamburger menu for mobile */}
            <IconButton
              onClick={() => setMobileOpen((prevState) => !prevState)}
              sx={{ display: { xs: 'flex', md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Left section: */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <Box
                component={Link}
                to={'/'}
                sx={{ display: { xs: 'none', md: 'block' }, mr: 2 }}
              >
                <Box component={'img'} sx={{ width: 55 }} src={logoPNG} />
              </Box>
              {LINKS_DATA.map((link) => (
                <Box
                  component={Link}
                  to={link.hash}
                  key={link.name}
                  sx={HEADER_LINK_STYLE}
                >
                  {link.name}
                </Box>
              ))}
            </Box>

            {/* Right section*/}
            <Box sx={HEADER_RIGHT_SECTION_STYLE}>
              <IconButton
                onClick={() => navigate('/cart')}
                title={'Cart'}
                color={'inherit'}
                component={Link}
                to={'/cart'}
              >
                <Badge badgeContent={getTotalProductCount()} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <IconButton title={'Login'} color={'inherit'}>
                <LoginIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box component={'nav'}>
        <Drawer
          variant={'temporary'}
          open={mobileOpen}
          onClose={() => setMobileOpen((prevState) => !prevState)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={HEADER_MOBILE_DRAWER_STYLE}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const HEADER_MOBILE_DRAWER_STYLE: SxProps<Theme> = {
  display: { xs: 'block', md: 'none' },
  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
};

const HEADER_RIGHT_SECTION_STYLE: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0,
  ml: 'auto',
};

const HEADER_APP_BAR_STYLE_TOP: SxProps<Theme> = {
  background: 'none',
  color: grey[50],
  boxShadow: 'none',
};

const HEADER_APP_BAR_STYLE: SxProps<Theme> = {
  background: 'transparent',
  backdropFilter: 'blur(14px)',
  color: grey[50],
  boxShadow: '0px 0px 4px white',
};

const HEADER_LINK_STYLE: SxProps<Theme> = {
  transition: '150ms',
  m: 2,
  textDecoration: 'none',
  color: grey[50],

  '&:hover': {
    color: grey[500],
  },
};
