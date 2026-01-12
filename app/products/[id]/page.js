'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Button,
  Chip,
  Rating,
  Divider
} from '@mui/material';
import { ArrowLeft, Package, Tag, TrendingUp, Star } from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';
import useProductsStore from '../../store/productsStore';
import { Toaster, toast } from 'sonner';

const InfoItem = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1" fontWeight="medium">
      {value}
    </Typography>
  </Box>
);

function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentProduct, loading, error, fetchProduct, clearError } = useProductsStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const productId = params.id;

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  useEffect(() => {
    if (currentProduct?.images) {
      setSelectedImage(0);
    }
  }, [currentProduct]);

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

  if (!currentProduct) {
    return (
      <ProtectedRoute>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography>Product not found</Typography>
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
          onClick={() => router.push('/products')}
          sx={{ mb: 3 }}
        >
          Back to Products
        </Button>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {/* Image Gallery */}
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={currentProduct.images?.[selectedImage] || currentProduct.thumbnail}
                alt={currentProduct.title}
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 2,
                  mb: 2
                }}
              />
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {currentProduct.images?.map((image, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={image}
                    alt={`${currentProduct.title} ${index + 1}`}
                    onClick={() => setSelectedImage(index)}
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 1,
                      cursor: 'pointer',
                      border: selectedImage === index ? '3px solid' : '1px solid',
                      borderColor: selectedImage === index ? 'primary.main' : 'grey.300',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main'
                      }
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Product Info */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label={currentProduct.category} color="primary" />
                <Chip label={currentProduct.brand} variant="outlined" />
                {currentProduct.stock > 0 ? (
                  <Chip label="In Stock" color="success" size="small" />
                ) : (
                  <Chip label="Out of Stock" color="error" size="small" />
                )}
              </Box>

              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {currentProduct.title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={currentProduct.rating} precision={0.1} readOnly />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {currentProduct.rating} / 5
                </Typography>
              </Box>

              <Typography variant="body1" color="text.secondary" paragraph>
                {currentProduct.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 3 }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  ${currentProduct.price}
                </Typography>
                {currentProduct.discountPercentage > 0 && (
                  <Chip 
                    label={`${currentProduct.discountPercentage}% OFF`} 
                    color="error"
                    icon={<Tag size={16} />}
                  />
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <InfoItem label="SKU" value={currentProduct.sku} />
                </Grid>
                <Grid item xs={6}>
                  <InfoItem label="Stock" value={`${currentProduct.stock} units`} />
                </Grid>
                <Grid item xs={6}>
                  <InfoItem label="Weight" value={`${currentProduct.weight} kg`} />
                </Grid>
                <Grid item xs={6}>
                  <InfoItem 
                    label="Dimensions" 
                    value={`${currentProduct.dimensions?.width} x ${currentProduct.dimensions?.height} x ${currentProduct.dimensions?.depth} cm`} 
                  />
                </Grid>
                <Grid item xs={6}>
                  <InfoItem label="Warranty" value={currentProduct.warrantyInformation} />
                </Grid>
                <Grid item xs={6}>
                  <InfoItem label="Shipping" value={currentProduct.shippingInformation} />
                </Grid>
                <Grid item xs={6}>
                  <InfoItem label="Return Policy" value={currentProduct.returnPolicy} />
                </Grid>
                <Grid item xs={6}>
                  <InfoItem label="Availability" value={currentProduct.availabilityStatus} />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Reviews Section */}
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Customer Reviews
              </Typography>
              {currentProduct.reviews?.map((review, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {review.reviewerName}
                    </Typography>
                    <Rating value={review.rating} size="small" readOnly />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {review.comment}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(review.date).toLocaleDateString()}
                  </Typography>
                </Paper>
              ))}
            </Grid>

            {/* Tags */}
            {currentProduct.tags && currentProduct.tags.length > 0 && (
              <Grid item xs={12}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {currentProduct.tags.map((tag, index) => (
                    <Chip key={index} label={tag} variant="outlined" size="small" />
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Container>
    </ProtectedRoute>
  );
}

export default ProductDetailPage;