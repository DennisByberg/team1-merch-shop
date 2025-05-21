import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AppBar,
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Badge,
  CircularProgress,
  Menu,
  MenuItem,
  SxProps,
  Theme,
} from '@mui/material';
import { grey, yellow } from '@mui/material/colors';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import logoPNG from '../assets/logo.png';
import { useIsTopScroll } from '../hooks/useIsTopScroll';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isTop = useIsTopScroll();
  const { getTotalProductCount } = useCart();
  const navigate = useNavigate();
  const { isAdmin, logout, isLoading } = useAuth();

  const [anchorElAdmin, setAnchorElAdmin] = useState<null | HTMLElement>(null);
  const openAdminMenu = Boolean(anchorElAdmin);
  const handleAdminMenuClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorElAdmin(e.currentTarget);
  };
  const handleAdminMenuClose = () => {
    setAnchorElAdmin(null);
  };

  const drawer = (
    <Box onClick={() => setMobileOpen((prev) => !prev)}>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/" sx={{ textAlign: 'center' }}>
            <ListItemText primary={'Home'} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to={'/store'} sx={{ textAlign: 'center' }}>
            <ListItemText primary={'Store'} />
          </ListItemButton>
        </ListItem>
        <Divider />
        {isLoading ? (
          <ListItem>
            <CircularProgress size={24} sx={{ margin: 'auto' }} />
          </ListItem>
        ) : isAdmin ? (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} to={'/admin'} sx={{ textAlign: 'center' }}>
                <AdminPanelSettingsIcon sx={{ mr: 1 }} />
                <ListItemText primary={'Admin'} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  logout();
                }}
                sx={{ textAlign: 'center' }}
              >
                <LogoutIcon sx={{ mr: 1 }} />
                <ListItemText primary={'Logga ut'} />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate('/admin-login')}
              sx={{ textAlign: 'center' }}
            >
              <LoginIcon sx={{ mr: 1 }} />
              <ListItemText primary={'Logga in'} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', pb: 1 }}>
      <AppBar
        component={motion.nav}
        initial={{ y: -200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        sx={isTop ? HEADER_APP_BAR_STYLE_TOP : HEADER_APP_BAR_STYLE}
      >
        <Container maxWidth="lg" disableGutters>
          <Toolbar sx={{ pl: 0, pt: 1 }}>
            {/* Hamburger för mobil */}
            <IconButton
              onClick={() => setMobileOpen((prev) => !prev)}
              sx={{ display: { xs: 'flex', md: 'none' } }}
              color={'inherit'}
            >
              <MenuIcon />
            </IconButton>

            {/* Left section */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <Box
                component={Link}
                to="/"
                sx={{ display: { xs: 'none', md: 'block' }, mr: 2 }}
              >
                <Box component={'img'} src={logoPNG} sx={{ width: 55 }} />
              </Box>
              <Box component={Link} to={'/'} sx={HEADER_LINK_STYLE}>
                Home
              </Box>
              <Box component={Link} to={'/store'} sx={HEADER_LINK_STYLE}>
                Store
              </Box>
              {isAdmin && (
                <Box component={Link} to={'/admin'} sx={HEADER_LINK_STYLE}>
                  Admin
                </Box>
              )}
            </Box>

            {/* Right section */}
            <Box sx={HEADER_RIGHT_SECTION_STYLE}>
              <IconButton component={Link} to={'/cart'} color={'inherit'} title={'Cart'}>
                <Badge badgeContent={getTotalProductCount()} color={'error'}>
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              {isLoading ? (
                <CircularProgress size={24} color={'inherit'} sx={{ ml: 1 }} />
              ) : isAdmin ? (
                <>
                  {/* Endast en iconbutton för admin */}
                  <IconButton
                    onClick={handleAdminMenuClick}
                    color={'inherit'}
                    title={'Admin-meny'}
                    sx={{ color: yellow[400] }}
                  >
                    <AdminPanelSettingsIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorElAdmin}
                    open={openAdminMenu}
                    onClose={handleAdminMenuClose}
                  >
                    <MenuItem
                      onClick={() => {
                        logout();
                        handleAdminMenuClose();
                      }}
                    >
                      <LogoutIcon sx={{ mr: 1 }} />
                      Log out
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <IconButton
                  onClick={() => navigate('/admin-login')}
                  color={'inherit'}
                  title={'Login'}
                >
                  <LoginIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile */}
      <Box component={'nav'}>
        <Drawer
          variant={'temporary'}
          open={mobileOpen}
          onClose={() => setMobileOpen((prev) => !prev)}
          ModalProps={{ keepMounted: true }}
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
  ml: 'auto',
  gap: 1,
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
  textTransform: 'none',
  padding: '6px 8px',
  '&:hover': {
    color: grey[500],
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
};
