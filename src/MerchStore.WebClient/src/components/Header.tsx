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
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Badge, SxProps, Theme, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useIsTopScroll } from '../hooks/useIsTopScroll';
import { useCart } from '../hooks/useCart';

type HeaderProps = {
  darkMode: boolean;
  onToggleDarkMode: () => void;
};

export default function Header({ darkMode, onToggleDarkMode }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isTop = useIsTopScroll();
  const { getTotalProductCount } = useCart();
  const navigate = useNavigate();

  // Only show Home and Catalog in the left section
  const leftLinks = LINKS_DATA.filter(
    (link) => link.name === 'Home' || link.name === 'Store'
  );

  const drawer = (
    <Box
      onClick={() => setMobileOpen((prevState) => !prevState)}
      sx={{ textAlign: 'center' }}
    >
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
        <Toolbar sx={{ pl: 0, pt: 1 }}>
          {/* Hamburger menu for mobile (left) */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge={false}
            onClick={() => setMobileOpen((prevState) => !prevState)}
            sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Left section: Logo + Home/Catalog (center/left on desktop) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <Box
              component={Link}
              to={'/'}
              sx={{ display: { xs: 'none', md: 'block' }, mr: 2 }}
            >
              <Box component={'img'} sx={{ width: 55 }} alt="Logo" src={logoPNG} />
            </Box>
            {leftLinks.map((link) => (
              <Box component={Link} to={link.hash} key={link.name} sx={HEADER_LINK_STYLE}>
                {link.name}
              </Box>
            ))}
          </Box>

          {/* Right section: Dark mode, Cart & Login (always right) */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0,
              ml: 'auto',
            }}
          >
            <IconButton
              sx={{ mr: 1 }}
              color="inherit"
              onClick={onToggleDarkMode}
              title="Toggle dark mode"
            >
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <IconButton
              onClick={() => navigate('/cart')}
              title={'Cart'}
              color="inherit"
              component={Link}
              to="/cart"
            >
              <Badge badgeContent={getTotalProductCount()} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton title={'Login'} color="inherit" component={Link} to="/login">
              <LoginIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component={'nav'}>
        <Drawer
          variant={'temporary'}
          open={mobileOpen}
          onClose={() => setMobileOpen((prevState) => !prevState)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const HEADER_APP_BAR_STYLE_TOP: SxProps<Theme> = () => {
  const theme = useTheme();

  return {
    background: 'none',
    color: theme.palette.mode === 'light' ? grey[900] : grey[50],
    boxShadow: 'none',
  };
};

const HEADER_APP_BAR_STYLE: SxProps<Theme> = () => {
  const theme = useTheme();

  return {
    background: 'transparent',
    backdropFilter: 'blur(14px)',
    color: theme.palette.mode === 'light' ? grey[900] : grey[50],
    boxShadow: theme.palette.mode === 'light' ? '0px 0px 4px black' : '0px 0px 4px white',
  };
};

const HEADER_LINK_STYLE: SxProps<Theme> = () => {
  const theme = useTheme();

  return {
    transition: '150ms',
    m: 2,
    textDecoration: 'none',
    color: theme.palette.mode === 'light' ? grey[900] : grey[50],

    '&:hover': {
      color: grey[500],
    },
  };
};
