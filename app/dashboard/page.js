'use client';

import { useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import { Users, Package, TrendingUp, ShoppingCart } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';
import useAuthStore from '../store/authStore';
import { Toaster } from 'sonner';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderLeft: `4px solid ${color}`,
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 6
      }
    }}
  >
    <Box>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" fontWeight="bold">
        {value}
      </Typography>
    </Box>
    <Box
      sx={{
        width: 60,
        height: 60,
        borderRadius: '50%',
        bgcolor: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Icon size={32} color={color} />
    </Box>
  </Paper>
);

function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <ProtectedRoute>
      <Toaster position="top-right" richColors />
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome back, {user?.firstName}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your dashboard today.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Users"
              value="208"
              icon={Users}
              color="#3b82f6"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Products"
              value="194"
              icon={Package}
              color="#10b981"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Sales"
              value="$12,345"
              icon={ShoppingCart}
              color="#f59e0b"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Growth"
              value="+23%"
              icon={TrendingUp}
              color="#8b5cf6"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" paragraph>
                  • View and manage users in the Users section
                </Typography>
                <Typography variant="body1" paragraph>
                  • Browse and filter products in the Products section
                </Typography>
                <Typography variant="body1" paragraph>
                  • Use the search functionality to find specific items
                </Typography>
                <Typography variant="body1">
                  • All data is cached for better performance
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Your Profile
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Name
                </Typography>
                <Typography variant="body1" paragraph>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Email
                </Typography>
                <Typography variant="body1" paragraph>
                  {user?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Role
                </Typography>
                <Typography variant="body1">
                  Administrator
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ProtectedRoute>
  );
}

export default DashboardPage;