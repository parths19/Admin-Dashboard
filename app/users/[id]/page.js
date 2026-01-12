'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Avatar,
  Divider,
  Button,
  Chip
} from '@mui/material';
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Calendar, User as UserIcon } from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';
import useUsersStore from '../../store/usersStore';
import { Toaster, toast } from 'sonner';

const InfoRow = ({ icon: Icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Icon size={20} style={{ marginRight: 12, color: '#666' }} />
    <Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight="medium">
        {value}
      </Typography>
    </Box>
  </Box>
);

function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser, loading, error, fetchUser, clearError } = useUsersStore();
  const userId = params.id;

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId, fetchUser]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  if (loading) {
    return (
      <ProtectedRoute>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress />
        </Box>
      </ProtectedRoute>
    );
  }

  if (!currentUser) {
    return (
      <ProtectedRoute>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography>User not found</Typography>
        </Container>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Toaster position="top-right" richColors />
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={() => router.push('/users')}
          sx={{ mb: 3 }}
        >
          Back to Users
        </Button>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {/* Profile Header */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                  src={currentUser.image}
                  alt={currentUser.firstName}
                  sx={{ width: 120, height: 120 }}
                />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {currentUser.firstName} {currentUser.lastName}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {currentUser.email}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip label={currentUser.gender} color="primary" size="small" />
                    <Chip label={`Age: ${currentUser.age}`} variant="outlined" size="small" />
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Contact Information
              </Typography>
              <InfoRow icon={Mail} label="Email" value={currentUser.email} />
              <InfoRow icon={Phone} label="Phone" value={currentUser.phone} />
              <InfoRow 
                icon={MapPin} 
                label="Address" 
                value={`${currentUser.address?.address}, ${currentUser.address?.city}, ${currentUser.address?.state}`} 
              />
            </Grid>

            {/* Professional Information */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Professional Information
              </Typography>
              <InfoRow icon={Briefcase} label="Company" value={currentUser.company?.name || 'N/A'} />
              <InfoRow icon={UserIcon} label="Department" value={currentUser.company?.department || 'N/A'} />
              <InfoRow icon={UserIcon} label="Job Title" value={currentUser.company?.title || 'N/A'} />
            </Grid>

            {/* Personal Information */}
            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Personal Information
              </Typography>
              <InfoRow icon={Calendar} label="Birth Date" value={currentUser.birthDate} />
              <InfoRow icon={UserIcon} label="Blood Group" value={currentUser.bloodGroup} />
              <InfoRow icon={UserIcon} label="Height" value={`${currentUser.height} cm`} />
              <InfoRow icon={UserIcon} label="Weight" value={`${currentUser.weight} kg`} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Other Details
              </Typography>
              <InfoRow icon={UserIcon} label="Eye Color" value={currentUser.eyeColor} />
              <InfoRow icon={UserIcon} label="Hair Color" value={`${currentUser.hair?.color} (${currentUser.hair?.type})`} />
              <InfoRow icon={UserIcon} label="University" value={currentUser.university} />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ProtectedRoute>
  );
}

export default UserDetailPage;