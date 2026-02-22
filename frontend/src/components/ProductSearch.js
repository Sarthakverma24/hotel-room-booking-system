import React, { useState, useEffect } from 'react';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Slider, Typography, Grid, Card, CardMedia, CardContent, Chip } from '@mui/material';
import { supabase } from '../api/supabase';

export default function ProductSearch() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('created_at');

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, sortBy]);

  const fetchProducts = async () => {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }

    query = query
      .gte('price', priceRange[0])
      .lte('price', priceRange[1])
      .order(sortBy, { ascending: false });

    const { data } = await query;
    setProducts(data || []);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" gap={2} mb={4} flexWrap="wrap">
        <TextField
          label="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1, minWidth: 250 }}
        />
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="created_at">Newest</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="name">Name</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 4, px: 2 }}>
        <Typography gutterBottom>Price Range: ${priceRange[0]} - ${priceRange[1]}</Typography>
        <Slider
          value={priceRange}
          onChange={(e, newValue) => setPriceRange(newValue)}
          onChangeCommitted={fetchProducts}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          sx={{ color: '#D4A574' }}
        />
      </Box>

      <Grid container spacing={3}>
        {products.map((product) => {
          const images = JSON.parse(product.images || '[]');
          const imageUrl = images[0]?.url || images[0] || 'https://via.placeholder.com/300';
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={imageUrl}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>{product.name}</Typography>
                  <Typography variant="h5" color="#D4A574" fontWeight="bold">
                    ${product.price}
                  </Typography>
                  <Chip
                    label={product.inventory_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    size="small"
                    color={product.inventory_quantity > 0 ? 'success' : 'error'}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
