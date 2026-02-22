import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Box,
  Chip,
  Tabs,
  Tab,
  Fade,
  Slide,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useScrollTrigger,
  CssBaseline,
  ThemeProvider,
  createTheme,
  styled,
  keyframes,
} from '@mui/material';
import {
  ShoppingBag,
  Favorite,
  Person,
  Search,
  Add,
  Storefront,
  LocalFireDepartment,
  Menu as MenuIcon,
  Logout,
  Settings,
  Dashboard,
  ArrowForward,
} from '@mui/icons-material';
import { supabase } from './api/supabase';
import AuthScreen from './components/AuthScreen';
import AdminDashboard from './screens/AdminDashboard';
import ProductSearch from './components/ProductSearch';
import ProductForm from './components/ProductForm';
import Cart from './components/Cart';

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#D4A574',
      light: '#E8C4A0',
      dark: '#C49564',
      contrastText: '#fff',
    },
    secondary: {
      main: '#2C1810',
      light: '#5C4A3A',
      dark: '#1A0F08',
    },
    background: {
      default: '#FDF8F3',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C1810',
      secondary: '#8B7355',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 16,
  },
});

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// Styled Components
const StyledAppBar = styled(AppBar)(({ theme, scrolled }) => ({
  background: scrolled 
    ? 'rgba(253, 248, 243, 0.95)' 
    : 'transparent',
  backdropFilter: scrolled ? 'blur(20px)' : 'none',
  boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.1)' : 'none',
  transition: 'all 0.3s ease',
  borderBottom: scrolled ? '1px solid rgba(212, 165, 116, 0.2)' : 'none',
}));

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
});

const LogoIcon = styled(Box)({
  width: 40,
  height: 40,
  borderRadius: 12,
  background: 'linear-gradient(135deg, #D4A574 0%, #C49564 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 15px rgba(212, 165, 116, 0.4)',
  animation: `${float} 3s ease-in-out infinite`,
});

const GradientText = styled(Typography)({
  background: 'linear-gradient(135deg, #2C1810 0%, #5C4A3A 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

const HeroSection = styled(Box)({
  background: 'linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 50%, #E8D5C4 100%)',
  minHeight: '70vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-20%',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(212,165,116,0.15) 0%, transparent 70%)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-30%',
    left: '-10%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(212,165,116,0.1) 0%, transparent 70%)',
  },
});

const StyledTab = styled(Tab)({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  minHeight: 48,
  borderRadius: 24,
  padding: '6px 20px',
  margin: '0 4px',
  transition: 'all 0.3s ease',
  '&.Mui-selected': {
    backgroundColor: 'rgba(212, 165, 116, 0.15)',
    color: '#D4A574',
  },
  '&:hover': {
    backgroundColor: 'rgba(212, 165, 116, 0.08)',
  },
});

const ActionButton = styled(Button)({
  borderRadius: 14,
  padding: '10px 24px',
  fontWeight: 700,
  textTransform: 'none',
  fontSize: '0.95rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(212, 165, 116, 0.4)',
    '&::after': {
      left: '100%',
    },
  },
});

const ProductCard = styled(Card)({
  borderRadius: 20,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
  },
});

const FloatingActionButton = styled(Button)({
  position: 'fixed',
  bottom: 32,
  right: 32,
  borderRadius: 50,
  padding: '16px 32px',
  fontWeight: 700,
  textTransform: 'none',
  fontSize: '1rem',
  boxShadow: '0 8px 30px rgba(212, 165, 116, 0.5)',
  zIndex: 1000,
  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: '0 12px 40px rgba(212, 165, 116, 0.6)',
  },
});

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showProductForm, setShowProductForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  useEffect(() => {
    checkUser();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCartCount();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin, full_name, avatar_url')
        .eq('id', user.id)
        .single();
      setIsAdmin(profile?.is_admin || false);
      setUserName(profile?.full_name || user.email);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setAnchorEl(null);
  };

  const handleAuthSuccess = (user) => {
    setUser(user);
    setShowAuth(false);
    checkUser();
  };

  const fetchCartCount = async () => {
    if (!user) return;
    try {
      const { count } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      setCartCount(count || 0);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, seller:profiles(full_name, avatar_url)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (showAuth) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthScreen onAuthSuccess={handleAuthSuccess} />
      </ThemeProvider>
    );
  }

  if (showProductForm) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
          <Container maxWidth="md" sx={{ pt: 4, pb: 8 }}>
            <Button 
              onClick={() => setShowProductForm(false)} 
              sx={{ mb: 3, color: '#8B7355' }}
              startIcon={<ArrowForward sx={{ transform: 'rotate(180deg)' }} />}
            >
              Back to Marketplace
            </Button>
            <ProductForm onSuccess={() => { 
              setShowProductForm(false); 
              fetchProducts(); 
            }} />
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Navigation */}
        <StyledAppBar position="fixed" scrolled={trigger ? 1 : 0}>
          <Toolbar sx={{ py: 1 }}>
            <LogoContainer onClick={() => setActiveTab(0)}>
              <Box
                component="img"
                src="/logo/sutrya.png"
                alt="Sutreya"
                sx={{ width: 40, height: 40, objectFit: 'contain' }}
              />
              <GradientText variant="h6" sx={{ fontWeight: 800, display: { xs: 'none', sm: 'block' } }}>
                Sutreya
              </GradientText>
            </LogoContainer>

            <Box sx={{ flexGrow: 1 }} />

            {user ? (
              <>
                <Tabs 
                  value={activeTab} 
                  onChange={(e, v) => setActiveTab(v)}
                  sx={{ 
                    mr: 3,
                    '& .MuiTabs-flexContainer': { gap: 1 },
                    display: { xs: 'none', md: 'flex' }
                  }}
                  textColor="primary"
                  indicatorColor="transparent"
                >
                  <StyledTab 
                    icon={<Storefront sx={{ fontSize: 18 }} />} 
                    iconPosition="start"
                    label="Shop" 
                  />
                  {isAdmin && (
                    <StyledTab 
                      icon={<Dashboard sx={{ fontSize: 18 }} />} 
                      iconPosition="start"
                      label="Dashboard" 
                    />
                  )}
                </Tabs>

                <IconButton sx={{ mr: 1, color: '#5C4A3A' }} onClick={() => setCartOpen(true)}>
                  <Badge badgeContent={cartCount} color="primary">
                    <ShoppingBag />
                  </Badge>
                </IconButton>

                <IconButton sx={{ mr: 1, color: '#5C4A3A' }}>
                  <Favorite />
                </IconButton>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                  <Chip
                    avatar={<Avatar src={user.user_metadata?.avatar_url} sx={{ bgcolor: '#D4A574' }}>{userName[0]?.toUpperCase()}</Avatar>}
                    label={userName.split(' ')[0]}
                    onClick={handleMenuOpen}
                    sx={{ 
                      bgcolor: 'rgba(212, 165, 116, 0.1)',
                      '&:hover': { bgcolor: 'rgba(212, 165, 116, 0.2)' },
                      cursor: 'pointer',
                      display: { xs: 'none', sm: 'flex' }
                    }}
                  />
                  <IconButton onClick={handleMenuOpen} sx={{ display: { sm: 'none' } }}>
                    <MenuIcon />
                  </IconButton>
                </Box>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: { 
                      mt: 1.5, 
                      minWidth: 200,
                      borderRadius: 3,
                      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    }
                  }}
                >
                  <MenuItem onClick={handleMenuClose}>
                    <Person sx={{ mr: 1, color: '#8B7355' }} /> Profile
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>
                    <Settings sx={{ mr: 1, color: '#8B7355' }} /> Settings
                  </MenuItem>
                  {isAdmin && (
                    <MenuItem onClick={() => { setActiveTab(1); handleMenuClose(); }}>
                      <Dashboard sx={{ mr: 1, color: '#8B7355' }} /> Admin Dashboard
                    </MenuItem>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <MenuItem onClick={handleLogout} sx={{ color: '#d32f2f' }}>
                    <Logout sx={{ mr: 1 }} /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <ActionButton 
                  color="inherit" 
                  onClick={() => setShowAuth(true)}
                  sx={{ color: '#5C4A3A' }}
                >
                  Login
                </ActionButton>
                <ActionButton 
                  variant="contained" 
                  onClick={() => setShowAuth(true)}
                  startIcon={<Person />}
                >
                  Get Started
                </ActionButton>
              </Box>
            )}
          </Toolbar>
        </StyledAppBar>

        {/* Main Content */}
        {activeTab === 1 && user && isAdmin ? (
          <AdminDashboard />
        ) : (
          <>
            {/* Hero Section */}
            <HeroSection>
              <Container maxWidth="lg">
                <Grid container spacing={6} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Fade in timeout={1000}>
                      <Box>
                        <Chip 
                          label="Handcrafted with Love"
                          sx={{ 
                            mb: 3, 
                            bgcolor: 'rgba(212, 165, 116, 0.15)',
                            color: '#D4A574',
                            fontWeight: 600,
                            py: 0.5,
                          }}
                          icon={<LocalFireDepartment sx={{ color: '#D4A574 !important' }} />}
                        />
                        <Typography 
                          variant="h2" 
                          sx={{ 
                            fontWeight: 800, 
                            color: '#2C1810',
                            mb: 2,
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                            lineHeight: 1.2,
                          }}
                        >
                          Discover Authentic{' '}
                          <Box component="span" sx={{ color: '#D4A574' }}>
                            Homemade
                          </Box>{' '}
                          Treasures
                        </Typography>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: '#8B7355', 
                            mb: 4,
                            fontWeight: 400,
                            lineHeight: 1.6,
                          }}
                        >
                          Connect with local artisans and find unique, handcrafted goods 
                          made with passion and tradition. Every piece tells a story.
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <ActionButton 
                            variant="contained" 
                            size="large"
                            startIcon={<Search />}
                          >
                            Explore Products
                          </ActionButton>
                          {user && isAdmin && (
                            <ActionButton 
                              variant="outlined" 
                              size="large"
                              startIcon={<Add />}
                              onClick={() => setShowProductForm(true)}
                              sx={{ borderColor: '#D4A574', color: '#D4A574' }}
                            >
                              Sell Your Craft
                            </ActionButton>
                          )}
                        </Box>
                      </Box>
                    </Fade>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Fade in timeout={1200}>
                      <Box sx={{ position: 'relative' }}>
                        <Box
                          component="img"
                          src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600"
                          alt="Handcrafted pottery"
                          sx={{
                            width: '100%',
                            height: 500,
                            objectFit: 'cover',
                            borderRadius: 8,
                            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                          }}
                        />

                      </Box>
                    </Fade>
                  </Grid>
                </Grid>
              </Container>
            </HeroSection>

            {/* Products Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography 
                  variant="h3" 
                  fontWeight="800" 
                  color="#2C1810" 
                  mb={2}
                >
                  Featured Creations
                </Typography>
                <Typography 
                  variant="h6" 
                  color="#8B7355"
                  maxWidth={600}
                  mx="auto"
                >
                  Handpicked products from our most talented artisans, 
                  ready to find a new home
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography 
                  variant="h3" 
                  fontWeight="800" 
                  color="#2C1810" 
                  mb={2}
                >
                  Featured Creations
                </Typography>
                <Typography 
                  variant="h6" 
                  color="#8B7355"
                  maxWidth={600}
                  mx="auto"
                >
                  Handpicked products from our most talented artisans, 
                  ready to find a new home
                </Typography>
              </Box>

              {loading ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography color="#8B7355">Loading amazing products...</Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {products.map((product, index) => {
                    const images = JSON.parse(product.images || '[]');
                    const imageUrl = images[0]?.url || images[0] || 'https://via.placeholder.com/300';
                    return (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                        <Slide direction="up" in timeout={300 + index * 100}>
                          <ProductCard>
                            <Box sx={{ position: 'relative' }}>
                              <CardMedia
                                component="img"
                                height={240}
                                image={imageUrl}
                                alt={product.name}
                                sx={{ objectFit: 'cover' }}
                              />
                              <Chip
                                label={product.category || 'Handmade'}
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  top: 12,
                                  left: 12,
                                  bgcolor: 'rgba(255,255,255,0.95)',
                                  color: '#5C4A3A',
                                  fontWeight: 600,
                                }}
                              />
                              <IconButton
                                sx={{
                                  position: 'absolute',
                                  top: 12,
                                  right: 12,
                                  bgcolor: 'rgba(255,255,255,0.9)',
                                  '&:hover': { bgcolor: '#fff' },
                                }}
                              >
                                <Favorite sx={{ fontSize: 18, color: '#D4A574' }} />
                              </IconButton>
                            </Box>
                            <CardContent sx={{ p: 2.5 }}>
                              <Typography 
                                variant="caption" 
                                color="#8B7355"
                                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}
                              >
                                <Storefront sx={{ fontSize: 14 }} />
                                {product.seller?.full_name || 'Unknown Artisan'}
                              </Typography>
                              <Typography variant="h6" fontWeight={700} color="#2C1810" noWrap>
                                {product.name}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1, mb: 1.5 }}>
                                <Box sx={{ color: '#D4A574', display: 'flex' }}>
                                  {'★'.repeat(Math.floor(product.rating || 5))}
                                </Box>
                                <Typography variant="caption" color="#8B7355">
                                  ({product.reviews || 0})
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" fontWeight={800} color="#D4A574">
                                  ${product.price}
                                </Typography>
                                {product.inventory_quantity > 0 ? (
                                  <Button
                                    size="small"
                                    variant="contained"
                                    onClick={async () => {
                                      if (!user) {
                                        setShowAuth(true);
                                        return;
                                      }
                                      try {
                                        console.log('Checking existing cart item...');
                                        const { data: existing, error: checkError } = await supabase
                                          .from('cart_items')
                                          .select('*')
                                          .eq('user_id', user.id)
                                          .eq('product_id', product.id)
                                          .maybeSingle();
                                        
                                        console.log('Existing item:', existing, 'Error:', checkError);
                                        
                                        if (existing) {
                                          console.log('Updating quantity...');
                                          const { data: updated, error: updateError } = await supabase
                                            .from('cart_items')
                                            .update({ quantity: existing.quantity + 1, updated_at: new Date() })
                                            .eq('id', existing.id)
                                            .select();
                                          console.log('Update result:', updated, 'Error:', updateError);
                                          if (updateError) throw updateError;
                                        } else {
                                          console.log('Inserting new item...');
                                          const { data: inserted, error: insertError } = await supabase
                                            .from('cart_items')
                                            .insert({
                                              user_id: user.id,
                                              product_id: product.id,
                                              quantity: 1
                                            })
                                            .select();
                                          console.log('Insert result:', inserted, 'Error:', insertError);
                                          if (insertError) throw insertError;
                                        }
                                        
                                        await fetchCartCount();
                                        alert('Added to cart!');
                                      } catch (error) {
                                        console.error('Error adding to cart:', error);
                                        alert('Failed to add to cart: ' + error.message);
                                      }
                                    }}
                                    sx={{
                                      minWidth: 'auto',
                                      px: 2,
                                      py: 0.5,
                                      borderRadius: 2,
                                      bgcolor: '#D4A574',
                                      '&:hover': { bgcolor: '#C49564' },
                                    }}
                                  >
                                    Add
                                  </Button>
                                ) : (
                                  <Chip label="Out of Stock" size="small" color="error" />
                                )}
                              </Box>
                            </CardContent>
                          </ProductCard>
                        </Slide>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Container>

            {/* Floating Action Button for Admin */}
            {user && isAdmin && (
              <FloatingActionButton
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowProductForm(true)}
              >
                Add Product
              </FloatingActionButton>
            )}
          </>
        )}

        {/* Cart Drawer */}
        <Cart open={cartOpen} onClose={() => { setCartOpen(false); fetchCartCount(); }} />
      </Box>
    </ThemeProvider>
  );
}