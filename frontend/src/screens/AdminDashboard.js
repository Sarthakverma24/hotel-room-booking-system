import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Box } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { supabase } from '../api/supabase';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });
    setProducts(data || []);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('seller_id', user.id);
      
      if (error) throw error;
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">Product Management</Typography>
        <Button variant="contained" startIcon={<Add />} sx={{ bgcolor: '#D4A574' }}>
          Add Product
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => {
                const images = JSON.parse(product.images || '[]');
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img src={images[0] || 'https://via.placeholder.com/50'} alt="" style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.inventory_quantity}</TableCell>
                    <TableCell>{product.is_active ? 'Active' : 'Inactive'}</TableCell>
                    <TableCell>
                      <IconButton size="small"><Edit /></IconButton>
                      <IconButton size="small" onClick={() => handleDelete(product.id)}><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
}
