import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Container,
  Fade,
  Slide,
  InputAdornment,
  IconButton,
  useTheme,
  styled,
  keyframes,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  LocalFireDepartment,
  Spa,
  Favorite,
} from '@mui/icons-material';
import { supabase } from '../api/supabase';

// Custom animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// Styled components
const AuthContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 50%, #E8D5C4 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(212,165,116,0.1) 0%, transparent 70%)',
    animation: `${pulse} 8s ease-in-out infinite`,
  },
}));

const DecorativeCircle = styled(Box)(({ theme, delay = 0 }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(212,165,116,0.2), rgba(212,165,116,0.05))',
  backdropFilter: 'blur(10px)',
  animation: `${float} 6s ease-in-out infinite`,
  animationDelay: `${delay}s`,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4, 5),
  borderRadius: 24,
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 20px 60px rgba(139, 115, 85, 0.15), 0 8px 25px rgba(139, 115, 85, 0.1)',
  border: '1px solid rgba(212, 165, 116, 0.2)',
  position: 'relative',
  overflow: 'hidden',
  maxWidth: 480,
  width: '100%',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: 'linear-gradient(90deg, #D4A574, #E8C4A0, #D4A574)',
    backgroundSize: '200% auto',
    animation: `${shimmer} 3s linear infinite`,
  },
}));

const TabButton = styled(Button)(({ theme, active }) => ({
  flex: 1,
  padding: theme.spacing(1.5),
  borderRadius: 12,
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: active ? '#D4A574' : 'transparent',
  color: active ? '#fff' : '#8B7355',
  boxShadow: active ? '0 4px 15px rgba(212, 165, 116, 0.4)' : 'none',
  '&:hover': {
    backgroundColor: active ? '#C49564' : 'rgba(212, 165, 116, 0.1)',
    transform: 'translateY(-2px)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: 'rgba(253, 248, 243, 0.5)',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: 'rgba(212, 165, 116, 0.3)',
      borderWidth: 2,
    },
    '&:hover fieldset': {
      borderColor: 'rgba(212, 165, 116, 0.6)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#D4A574',
      borderWidth: 2,
      boxShadow: '0 0 0 4px rgba(212, 165, 116, 0.1)',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#A89B8C',
    fontWeight: 500,
    '&.Mui-focused': {
      color: '#D4A574',
    },
  },
  '& .MuiInputAdornment-root': {
    color: '#D4A574',
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.8),
  fontSize: '1.1rem',
  fontWeight: 700,
  textTransform: 'none',
  background: 'linear-gradient(135deg, #D4A574 0%, #C49564 100%)',
  boxShadow: '0 4px 15px rgba(212, 165, 116, 0.4)',
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
    boxShadow: '0 8px 25px rgba(212, 165, 116, 0.5)',
    '&::after': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&:disabled': {
    background: 'linear-gradient(135deg, #E8D5C4 0%, #D4C4B0 100%)',
    color: '#fff',
  },
}));

export default function AuthScreen({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      setSuccess('Welcome back to Sutreya! 🏺');
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(data.user);
      }, 800);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      
      if (error) throw error;
      
      setSuccess('Account created! Please verify your email to start crafting. ✨');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setFullName('');
  };

  return (
    <AuthContainer>
      {/* Decorative floating elements */}
      <DecorativeCircle sx={{ width: 300, height: 300, top: '10%', left: '5%', delay: 0 }} />
      <DecorativeCircle sx={{ width: 200, height: 200, top: '60%', right: '10%', delay: 2 }} />
      <DecorativeCircle sx={{ width: 150, height: 150, bottom: '10%', left: '15%', delay: 4 }} />
      
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in={mounted} timeout={1000}>
          <Box>
            <StyledPaper elevation={0}>
              {/* Logo Section */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto',
                    background: 'linear-gradient(135deg, #D4A574 0%, #E8C4A0 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 30px rgba(212, 165, 116, 0.4)',
                    mb: 2,
                    animation: `${float} 6s ease-in-out infinite`,
                  }}
                >
                  <LocalFireDepartment sx={{ fontSize: 40, color: '#fff' }} />
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #2C1810 0%, #5C4A3A 100%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.5px',
                  }}
                >
                  Sutreya
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#8B7355',
                    mt: 1,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                  }}
                >
                  <Spa sx={{ fontSize: 16 }} />
                  Handcrafted with love
                  <Favorite sx={{ fontSize: 16, color: '#D4A574' }} />
                </Typography>
              </Box>

              {/* Tab Switcher */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  backgroundColor: 'rgba(212, 165, 116, 0.1)',
                  borderRadius: 14,
                  padding: 0.5,
                  mb: 4,
                }}
              >
                <TabButton
                  active={isLogin ? 1 : 0}
                  onClick={() => !isLogin && toggleMode()}
                  fullWidth
                >
                  Welcome Back
                </TabButton>
                <TabButton
                  active={!isLogin ? 1 : 0}
                  onClick={() => isLogin && toggleMode()}
                  fullWidth
                >
                  Join Community
                </TabButton>
              </Box>

              {/* Alerts */}
              <Fade in={!!error}>
                <Box>
                  {error && (
                    <Alert
                      severity="error"
                      sx={{
                        mb: 3,
                        borderRadius: 3,
                        backgroundColor: 'rgba(211, 47, 47, 0.05)',
                        border: '1px solid rgba(211, 47, 47, 0.2)',
                      }}
                    >
                      {error}
                    </Alert>
                  )}
                </Box>
              </Fade>

              <Fade in={!!success}>
                <Box>
                  {success && (
                    <Alert
                      severity="success"
                      sx={{
                        mb: 3,
                        borderRadius: 3,
                        backgroundColor: 'rgba(46, 125, 50, 0.05)',
                        border: '1px solid rgba(46, 125, 50, 0.2)',
                      }}
                    >
                      {success}
                    </Alert>
                  )}
                </Box>
              </Fade>

              {/* Form */}
              <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                <Box component="form" onSubmit={isLogin ? handleLogin : handleSignup}>
                  {!isLogin && (
                    <StyledTextField
                      fullWidth
                      label="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      margin="normal"
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                  )}

                  <StyledTextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  <StyledTextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: '#D4A574' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    helperText={!isLogin && "At least 6 characters"}
                    sx={{ mb: 3 }}
                  />

                  <SubmitButton
                    fullWidth
                    variant="contained"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          component="span"
                          sx={{
                            width: 20,
                            height: 20,
                            border: '2px solid #fff',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            '@keyframes spin': {
                              '0%': { transform: 'rotate(0deg)' },
                              '100%': { transform: 'rotate(360deg)' },
                            },
                          }}
                        />
                        {isLogin ? 'Signing in...' : 'Creating account...'}
                      </Box>
                    ) : (
                      isLogin ? 'Sign In to Sutreya' : 'Start Your Journey'
                    )}
                  </SubmitButton>

                  {isLogin && (
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#8B7355',
                          cursor: 'pointer',
                          '&:hover': { color: '#D4A574' },
                          transition: 'color 0.3s',
                        }}
                      >
                        Forgot your password?
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Slide>

              {/* Footer */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#A89B8C' }}>
                  By continuing, you agree to our{' '}
                  <span style={{ color: '#D4A574', cursor: 'pointer', fontWeight: 600 }}>
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span style={{ color: '#D4A574', cursor: 'pointer', fontWeight: 600 }}>
                    Privacy Policy
                  </span>
                </Typography>
              </Box>
            </StyledPaper>

            {/* Bottom tagline */}
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                mt: 3,
                color: '#8B7355',
                opacity: 0.8,
                fontStyle: 'italic',
              }}
            >
              "Every handmade piece tells a story"
            </Typography>
          </Box>
        </Fade>
      </Container>
    </AuthContainer>
  );
}