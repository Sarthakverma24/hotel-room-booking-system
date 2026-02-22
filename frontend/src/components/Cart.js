import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  Alert,
} from '@mui/material';
import { Close, Delete, Add, Remove, ShoppingCart } from '@mui/icons-material';
import { supabase } from '../api/supabase';

export default function Cart({ open, onClose }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (open && user) {
      fetchCart();
    }
  }, [open, user]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      console.log('Fetching cart for user:', user.id);
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, product:products(*)')
        .eq('user_id', user.id);

      console.log('Cart fetch result:', { data, error });
      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity, updated_at: new Date() })
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (productId) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearCart = async () => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const total = cartItems.reduce((sum, item) => 
    sum + (item.product?.price || 0) * item.quantity, 0
  );

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingCart sx={{ color: '#D4A574' }} />
            <Typography variant="h6" fontWeight={700}>Your Cart</Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        {/* Cart Items */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {!user ? (
            <Alert severity="info">Please login to view your cart</Alert>
          ) : cartItems.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <ShoppingCart sx={{ fontSize: 64, color: '#E8D5C4', mb: 2 }} />
              <Typography color="text.secondary">Your cart is empty</Typography>
            </Box>
          ) : (
            <List>
              {cartItems.map((item) => {
                const images = JSON.parse(item.product?.images || '[]');
                const imageUrl = images[0]?.url || images[0] || 'https://via.placeholder.com/60';
                return (
                  <ListItem
                  key={item.id}
                  sx={{
                    mb: 2,
                    bgcolor: '#FDF8F3',
                    borderRadius: 2,
                    flexDirection: 'column',
                    alignItems: 'stretch',
                  }}
                >
                  <Box sx={{ display: 'flex', width: '100%', mb: 1 }}>
                    <ListItemAvatar>
                      <Avatar
                        src={imageUrl}
                        variant="rounded"
                        sx={{ width: 60, height: 60 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.product?.name}
                      secondary={`$${(item.product?.price || 0).toFixed(2)}`}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                    <IconButton size="small" onClick={() => removeItem(item.product_id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography sx={{ minWidth: 30, textAlign: 'center' }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography fontWeight={700} color="#D4A574">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                </ListItem>
                );
              })}
            </List>
          )}
        </Box>

        {/* Footer */}
        {cartItems.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" fontWeight={800} color="#D4A574">
                ${total.toFixed(2)}
              </Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mb: 1, bgcolor: '#D4A574', '&:hover': { bgcolor: '#C49564' } }}
            >
              Checkout
            </Button>
            <Button fullWidth variant="text" onClick={clearCart} color="error">
              Clear Cart
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
