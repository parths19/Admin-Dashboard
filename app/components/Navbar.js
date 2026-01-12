'use client';

import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import useAuthStore from '../store/authStore';
import { LogOut, User, Package, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated) return null;

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          Admin Dashboard
        </Typography>
        
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            onClick={() => router.push('/dashboard')}
            sx={{ 
              borderBottom: pathname === '/dashboard' ? '2px solid white' : 'none'
            }}
            startIcon={<LayoutDashboard size={18} />}
          >
            Dashboard
          </Button>
          <Button 
            color="inherit" 
            onClick={() => router.push('/users')}
            sx={{ 
              borderBottom: pathname.startsWith('/users') ? '2px solid white' : 'none'
            }}
            startIcon={<User size={18} />}
          >
            Users
          </Button>
          <Button 
            color="inherit" 
            onClick={() => router.push('/products')}
            sx={{ 
              borderBottom: pathname.startsWith('/products') ? '2px solid white' : 'none'
            }}
            startIcon={<Package size={18} />}
          >
            Products
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">
            {user?.firstName} {user?.lastName}
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<LogOut size={18} />}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;