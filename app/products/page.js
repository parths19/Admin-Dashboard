'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Container,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  CircularProgress,
  TextField,
  InputAdornment,
  Button,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Rating
} from '@mui/material';
import { Search, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';
import useProductsStore from '../store/productsStore';
import { Toaster, toast } from 'sonner';

function ProductsPage() {
  const router = useRouter();
  const { products, total, categories, loading, error, fetchProducts, fetchCategories, clearError } = useProductsStore();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const itemsPerPage = 12;

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch products
  useEffect(() => {
    const skip = (page - 1) * itemsPerPage;
    fetchProducts(itemsPerPage, skip, debouncedSearch, selectedCategory);
  }, [page, debouncedSearch, selectedCategory, fetchProducts]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCategoryChange = useCallback((event) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  }, []);

  const handleViewProduct = useCallback((productId) => {
    router.push(`/products/${productId}`);
  }, [router]);

  const totalPages = useMemo(() => Math.ceil(total / itemsPerPage), [total]);

  return (
    <ProtectedRoute>
      <Toaster position="top-right" richColors />
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Products Catalog
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse, search, and filter through our product collection
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.slug} value={category.slug}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {products.length === 0 ? (
                <Grid item xs={12}>
                  <Paper sx={{ p: 8, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      No products found
                    </Typography>
                  </Paper>
                </Grid>
              ) : (
                products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 6
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.thumbnail}
                        alt={product.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="div" noWrap>
                          {product.title}
                        </Typography>
                        <Chip 
                          label={product.category} 
                          size="small" 
                          sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={product.rating} precision={0.1} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({product.rating})
                          </Typography>
                        </Box>
                        <Typography variant="h5" color="primary" fontWeight="bold">
                          ${product.price}
                        </Typography>
                        {product.discountPercentage > 0 && (
                          <Chip 
                            label={`-${product.discountPercentage}%`} 
                            size="small" 
                            color="error"
                            sx={{ mt: 1 }}
                          />
                        )}
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          fullWidth 
                          variant="contained"
                          startIcon={<Eye size={16} />}
                          onClick={() => handleViewProduct(product.id)}
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </ProtectedRoute>
  );
}

export default ProductsPage;