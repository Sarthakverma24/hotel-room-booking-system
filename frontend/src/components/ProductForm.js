import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Chip,
  Divider,
  Fade,
  Grow,
  Paper,
  Tooltip,
  LinearProgress,
  Alert,
  useTheme,
  styled,
  keyframes,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  DragIndicator,
  CheckCircle,
  AddPhotoAlternate,
  Videocam,
  Info,
  LocalFireDepartment,
  Inventory,
  AttachMoney,
  Description,
  Category,
  ArrowForward,
  ArrowBack,
  Save,
  Star,
  Warning,
} from '@mui/icons-material';
import { supabase } from '../api/supabase';

// Animations
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 24,
  background: 'linear-gradient(135deg, #FFFFFF 0%, #FDF8F3 100%)',
  boxShadow: '0 20px 60px rgba(139, 115, 85, 0.12), 0 8px 25px rgba(139, 115, 85, 0.08)',
  border: '1px solid rgba(212, 165, 116, 0.15)',
  overflow: 'visible',
}));

const StepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: ownerState.active ? '#D4A574' : ownerState.completed ? '#2E7D32' : '#A89B8C',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#D4A574',
  }),
  '& .StepIcon-completedIcon': {
    color: '#2E7D32',
    zIndex: 1,
    fontSize: 18,
  },
  '& .StepIcon-circle': {
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: ownerState.active ? '#D4A574' : ownerState.completed ? '#E8F5E9' : 'transparent',
    border: `2px solid ${ownerState.active ? '#D4A574' : ownerState.completed ? '#2E7D32' : '#A89B8C'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: ownerState.active ? '#fff' : ownerState.completed ? '#2E7D32' : '#A89B8C',
    fontWeight: 700,
    fontSize: 14,
    transition: 'all 0.3s ease',
  },
}));

const UploadZone = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isDragActive',
})(({ theme, isDragActive }) => ({
  border: `2px dashed ${isDragActive ? '#D4A574' : 'rgba(212, 165, 116, 0.4)'}`,
  borderRadius: 20,
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: isDragActive ? 'rgba(212, 165, 116, 0.08)' : 'rgba(253, 248, 243, 0.5)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    borderColor: '#D4A574',
    backgroundColor: 'rgba(212, 165, 116, 0.08)',
    transform: 'translateY(-2px)',
  },
}));

const ImagePreviewCard = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
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
    color: '#8B7355',
    fontWeight: 500,
    '&.Mui-focused': {
      color: '#D4A574',
    },
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: '12px 32px',
  fontWeight: 700,
  textTransform: 'none',
  fontSize: '1rem',
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
    boxShadow: '0 8px 20px rgba(212, 165, 116, 0.4)',
    '&::after': {
      left: '100%',
    },
  },
}));

const steps = [
  { label: 'Basic Info', icon: Description, description: 'Product details & story' },
  { label: 'Media', icon: AddPhotoAlternate, description: 'Images & videos' },
  { label: 'Pricing', icon: AttachMoney, description: 'Inventory & pricing' },
];

// Custom Step Icon
function StepIcon(props) {
  const { active, completed, className, icon } = props;
  const icons = {
    1: <Description fontSize="small" />,
    2: <AddPhotoAlternate fontSize="small" />,
    3: <AttachMoney fontSize="small" />,
  };

  return (
    <StepIconRoot ownerState={{ completed, active }} className={className}>
      {completed ? (
        <CheckCircle className="StepIcon-completedIcon" />
      ) : (
        <div className="StepIcon-circle">{icons[String(icon)]}</div>
      )}
    </StepIconRoot>
  );
}

export default function ProductForm({ onSuccess }) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    compareAtPrice: '',
    inventoryQuantity: '',
    type: 'PHYSICAL',
    category: '',
    materials: '',
    processingDays: '',
    tags: [],
  });
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef(null);
  const submitRef = useRef(false);

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prev) => prev + 1);
      setError('');
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        if (!formData.name.trim()) {
          setError('Product name is required');
          return false;
        }
        if (!formData.description.trim()) {
          setError('Description is required');
          return false;
        }
        return true;
      case 1:
        if (images.length === 0) {
          setError('At least one image is required');
          return false;
        }
        return true;
      case 2:
        if (!formData.price || parseFloat(formData.price) <= 0) {
          setError('Valid price is required');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    await processFiles(files);
  };

  const processFiles = async (files) => {
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      
      const id = Date.now() + Math.random();
      setUploadProgress((prev) => ({ ...prev, [id]: 0 }));

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => ({
            ...prev,
            [id]: Math.min((prev[id] || 0) + 10, 90),
          }));
        }, 200);

        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, file);

        clearInterval(progressInterval);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);

        setUploadProgress((prev) => ({ ...prev, [id]: 100 }));
        
        setTimeout(() => {
          setImages((prev) => [...prev, { id, url: publicUrl, name: file.name, isMain: prev.length === 0 }]);
          setUploadProgress((prev) => {
            const newProgress = { ...prev };
            delete newProgress[id];
            return newProgress;
          });
        }, 500);
      } catch (err) {
        setError(`Failed to upload ${file.name}`);
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[id];
          return newProgress;
        });
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const removeImage = (idToRemove) => {
    setImages(images.filter((img) => img.id !== idToRemove));
  };

  const setMainImage = (id) => {
    setImages(images.map((img) => ({ ...img, isMain: img.id === id })));
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async () => {
    console.log('=== SUBMIT STARTED ===');
    console.log('validateStep:', validateStep());
    console.log('isSubmitting:', isSubmitting);
    console.log('submitRef.current:', submitRef.current);
    
    if (!validateStep()) {
      console.log('Validation failed, aborting');
      return;
    }
    if (isSubmitting || submitRef.current) {
      console.log('Already submitting, aborting');
      return;
    }

    console.log('Setting submit flags...');
    submitRef.current = true;
    setIsSubmitting(true);
    setError('');

    try {
      console.log('Getting user...');
      const { data: { user } } = await supabase.auth.getUser();
      console.log('User ID:', user.id);
      
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now();
      console.log('Generated slug:', slug);

      const productData = {
        seller_id: user.id,
        name: formData.name,
        slug,
        description: formData.description,
        short_description: formData.shortDescription,
        price: parseFloat(formData.price),
        compare_at_price: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        inventory_quantity: parseInt(formData.inventoryQuantity) || 0,
        type: formData.type,
        category: formData.category || null,
        materials: formData.materials,
        processing_days: parseInt(formData.processingDays) || null,
        tags: formData.tags,
        images: JSON.stringify(images.map((img, idx) => ({
          url: img.url,
          is_main: img.isMain,
          display_order: idx,
        }))),
        is_active: true,
      };

      console.log('Inserting product...', productData);
      const { data: insertedData, error: insertError } = await supabase
        .from('products')
        .insert(productData)
        .select();

      console.log('Insert result:', { insertedData, insertError });

      if (insertError) throw insertError;

      console.log('Product created successfully!');
      
      // Reset form and notify success
      setFormData({
        name: '',
        description: '',
        shortDescription: '',
        price: '',
        compareAtPrice: '',
        inventoryQuantity: '',
        type: 'PHYSICAL',
        category: '',
        materials: '',
        processingDays: '',
        tags: [],
      });
      setImages([]);
      setActiveStep(0);
      
      console.log('Calling onSuccess...');
      onSuccess();
      console.log('=== SUBMIT COMPLETED ===');
    } catch (err) {
      console.error('=== SUBMIT ERROR ===', err);
      setError(err.message || 'Failed to create product');
      submitRef.current = false;
    } finally {
      console.log('Resetting isSubmitting flag');
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Fade in={true} timeout={500}>
            <Box>
              <Typography variant="h5" fontWeight={700} color="#2C1810" mb={1}>
                Tell Your Product's Story
              </Typography>
              <Typography variant="body2" color="#8B7355" mb={4}>
                Share the details that make your handmade creation special
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    label="Product Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Handcrafted Ceramic Vase"
                    helperText="Choose a name that describes your creation"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: '#8B7355' }}>Product Type</InputLabel>
                    <Select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      sx={{ borderRadius: 3, backgroundColor: 'rgba(253, 248, 243, 0.5)' }}
                    >
                      <MenuItem value="PHYSICAL">Physical Product</MenuItem>
                      <MenuItem value="MADE_TO_ORDER">Made to Order</MenuItem>
                      <MenuItem value="DIGITAL">Digital Download</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Pottery"
                  />
                </Grid>

                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    label="Short Description *"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief, compelling summary (appears in product cards)"
                    inputProps={{ maxLength: 160 }}
                    helperText={`${formData.shortDescription.length}/160 characters - Used for SEO and previews`}
                  />
                </Grid>

                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Full Description *"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your product's story, materials, process, and what makes it special..."
                    helperText="Tip: Include dimensions, care instructions, and the inspiration behind your creation"
                  />
                </Grid>

                {formData.type === 'MADE_TO_ORDER' && (
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      type="number"
                      label="Processing Days"
                      value={formData.processingDays}
                      onChange={(e) => setFormData({ ...formData, processingDays: e.target.value })}
                      helperText="How long to create this item?"
                      InputProps={{
                        endAdornment: <Typography color="#8B7355">days</Typography>,
                      }}
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    label="Materials Used"
                    value={formData.materials}
                    onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                    placeholder="e.g., Stoneware clay, lead-free glaze, natural fibers"
                    helperText="Comma-separated list of materials (helps with search and filters)"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="#5C4A3A" fontWeight={600} mb={1}>
                    Tags
                  </Typography>
                  <StyledTextField
                    fullWidth
                    label="Add tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    placeholder="Type and press Enter to add tags (e.g., handmade, gift, rustic)"
                    helperText="Tags help customers find your product"
                  />
                  <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                    {formData.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => removeTag(tag)}
                        sx={{
                          backgroundColor: 'rgba(212, 165, 116, 0.15)',
                          color: '#5C4A3A',
                          fontWeight: 500,
                          '& .MuiChip-deleteIcon': {
                            color: '#8B7355',
                            '&:hover': { color: '#D4A574' },
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );

      case 1:
        return (
          <Fade in={true} timeout={500}>
            <Box>
              <Typography variant="h5" fontWeight={700} color="#2C1810" mb={1}>
                Showcase Your Creation
              </Typography>
              <Typography variant="body2" color="#8B7355" mb={4}>
                High-quality photos increase sales by 40%. Add multiple angles and details.
              </Typography>

              <UploadZone
                isDragActive={isDragActive}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                elevation={0}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(212, 165, 116, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    animation: `${float} 3s ease-in-out infinite`,
                  }}
                >
                  <CloudUpload sx={{ fontSize: 40, color: '#D4A574' }} />
                </Box>
                <Typography variant="h6" color="#2C1810" fontWeight={600} mb={1}>
                  {isDragActive ? 'Drop files here' : 'Drag & drop your files'}
                </Typography>
                <Typography variant="body2" color="#8B7355" mb={2}>
                  or click to browse from your device
                </Typography>
                <Chip
                  icon={<AddPhotoAlternate />}
                  label="Supports: JPG, PNG, WebP, MP4"
                  sx={{ backgroundColor: 'rgba(212, 165, 116, 0.1)', color: '#8B7355' }}
                />
              </UploadZone>

              {/* Upload Progress */}
              {Object.keys(uploadProgress).length > 0 && (
                <Box mt={3}>
                  {Object.entries(uploadProgress).map(([id, progress]) => (
                    <Box key={id} mb={2}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="#5C4A3A">
                          Uploading...
                        </Typography>
                        <Typography variant="body2" color="#D4A574" fontWeight={600}>
                          {progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(212, 165, 116, 0.2)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#D4A574',
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}

              {/* Image Previews */}
              {images.length > 0 && (
                <Box mt={4}>
                  <Typography variant="subtitle1" fontWeight={700} color="#2C1810" mb={2}>
                    Uploaded Images ({images.length})
                    {images.some((img) => img.isMain) && (
                      <Chip
                        size="small"
                        label="Main image set"
                        sx={{
                          ml: 1,
                          backgroundColor: '#E8F5E9',
                          color: '#2E7D32',
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Typography>
                  <Grid container spacing={2}>
                    {images.map((img, index) => (
                      <Grid item xs={6} sm={4} md={3} key={img.id}>
                        <Grow in={true} timeout={300 + index * 100}>
                          <ImagePreviewCard>
                            <Box position="relative">
                              <img
                                src={img.url}
                                alt={img.name}
                                style={{
                                  width: '100%',
                                  height: 160,
                                  objectFit: 'cover',
                                  display: 'block',
                                }}
                              />
                              {img.isMain && (
                                <Box
                                  position="absolute"
                                  top={8}
                                  left={8}
                                  sx={{
                                    backgroundColor: '#D4A574',
                                    color: '#fff',
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 2,
                                    fontSize: 12,
                                    fontWeight: 700,
                                  }}
                                >
                                  MAIN
                                </Box>
                              )}
                              <IconButton
                                size="small"
                                onClick={() => removeImage(img.id)}
                                sx={{
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  backgroundColor: 'rgba(255,255,255,0.9)',
                                  '&:hover': { backgroundColor: '#fff', color: '#d32f2f' },
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                            <Box p={2}>
                              <Typography variant="body2" color="#5C4A3A" noWrap fontWeight={500}>
                                {img.name}
                              </Typography>
                              {!img.isMain && (
                                <Button
                                  size="small"
                                  onClick={() => setMainImage(img.id)}
                                  sx={{
                                    mt: 1,
                                    color: '#D4A574',
                                    fontWeight: 600,
                                    fontSize: 12,
                                  }}
                                >
                                  Set as Main
                                </Button>
                              )}
                            </Box>
                          </ImagePreviewCard>
                        </Grow>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              <Alert
                severity="info"
                sx={{
                  mt: 4,
                  borderRadius: 3,
                  backgroundColor: 'rgba(212, 165, 116, 0.08)',
                  border: '1px solid rgba(212, 165, 116, 0.2)',
                  '& .MuiAlert-icon': { color: '#D4A574' },
                }}
              >
                <Typography variant="body2" color="#5C4A3A">
                  <strong>Pro tip:</strong> Use natural lighting, show scale with everyday objects, and include detail shots of textures and craftsmanship.
                </Typography>
              </Alert>
            </Box>
          </Fade>
        );

      case 2:
        return (
          <Fade in={true} timeout={500}>
            <Box>
              <Typography variant="h5" fontWeight={700} color="#2C1810" mb={1}>
                Set Your Price & Inventory
              </Typography>
              <Typography variant="body2" color="#8B7355" mb={4}>
                Price competitively while ensuring fair compensation for your craftsmanship
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    type="number"
                    label="Price *"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1, color: '#8B7355' }}>$</Typography>,
                    }}
                    helperText="Your selling price (what customers pay)"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    type="number"
                    label="Compare at Price"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    placeholder="0.00"
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1, color: '#8B7355' }}>$</Typography>,
                    }}
                    helperText="Original price (shows as strikethrough for sales)"
                  />
                </Grid>

                {formData.compareAtPrice && parseFloat(formData.compareAtPrice) > parseFloat(formData.price) && (
                  <Grid item xs={12}>
                    <Chip
                      icon={<Star sx={{ fontSize: 16 }} />}
                      label={`Save $${(parseFloat(formData.compareAtPrice) - parseFloat(formData.price)).toFixed(2)} (${Math.round((1 - parseFloat(formData.price) / parseFloat(formData.compareAtPrice)) * 100)}% off)`}
                      sx={{
                        backgroundColor: '#E8F5E9',
                        color: '#2E7D32',
                        fontWeight: 700,
                        py: 1,
                      }}
                    />
                  </Grid>
                )}

                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    type="number"
                    label="Inventory Quantity"
                    value={formData.inventoryQuantity}
                    onChange={(e) => setFormData({ ...formData, inventoryQuantity: e.target.value })}
                    placeholder="0"
                    helperText="Current stock available"
                    InputProps={{
                      endAdornment: <Inventory sx={{ color: '#8B7355', ml: 1 }} />,
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      borderColor: 'rgba(212, 165, 116, 0.3)',
                      backgroundColor: 'rgba(253, 248, 243, 0.5)',
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle2" fontWeight={700} color="#2C1810" mb={2}>
                        <LocalFireDepartment sx={{ fontSize: 16, mr: 1, color: '#D4A574', verticalAlign: 'middle' }} />
                        Preview Summary
                      </Typography>
                      <Box display="flex" gap={2} mb={2}>
                        {images.find((img) => img.isMain)?.url && (
                          <img
                            src={images.find((img) => img.isMain).url}
                            alt="Main"
                            style={{
                              width: 80,
                              height: 80,
                              objectFit: 'cover',
                              borderRadius: 12,
                            }}
                          />
                        )}
                        <Box>
                          <Typography variant="body1" fontWeight={700} color="#2C1810">
                            {formData.name || 'Untitled Product'}
                          </Typography>
                          <Typography variant="body2" color="#8B7355">
                            {formData.category || 'No category'}
                          </Typography>
                          <Typography variant="h6" color="#D4A574" fontWeight={700} mt={0.5}>
                            ${formData.price || '0.00'}
                            {formData.compareAtPrice && (
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                  textDecoration: 'line-through',
                                  color: '#A89B8C',
                                  ml: 1,
                                }}
                              >
                                ${formData.compareAtPrice}
                              </Typography>
                            )}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="#5C4A3A" noWrap>
                        {formData.shortDescription || 'No description provided'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 900, margin: '0 auto', p: { xs: 2, md: 4 } }}>
      <StyledCard>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                background: 'linear-gradient(135deg, #2C1810 0%, #5C4A3A 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Create New Product
            </Typography>
            <Typography variant="body1" color="#8B7355">
              Share your handmade creation with the world
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              mb: 5,
              '& .MuiStepConnector-line': {
                borderColor: 'rgba(212, 165, 116, 0.3)',
                borderWidth: 2,
              },
              '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                borderColor: '#D4A574',
              },
              '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                borderColor: '#2E7D32',
              },
            }}
          >
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  StepIconComponent={StepIcon}
                  optional={
                    <Typography
                      variant="caption"
                      color={activeStep === index ? '#D4A574' : '#A89B8C'}
                      sx={{ mt: 0.5 }}
                    >
                      {step.description}
                    </Typography>
                  }
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 3,
                backgroundColor: 'rgba(211, 47, 47, 0.05)',
                border: '1px solid rgba(211, 47, 47, 0.2)',
              }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          {/* Step Content */}
          <Box minHeight={400}>{renderStepContent()}</Box>

          {/* Navigation */}
          <Divider sx={{ my: 4, borderColor: 'rgba(212, 165, 116, 0.2)' }} />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <ActionButton
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0 || isSubmitting}
              startIcon={<ArrowBack />}
              sx={{
                borderColor: 'rgba(212, 165, 116, 0.5)',
                color: '#8B7355',
                '&:hover': {
                  borderColor: '#D4A574',
                  backgroundColor: 'rgba(212, 165, 116, 0.05)',
                },
                '&.Mui-disabled': {
                  borderColor: 'rgba(168, 155, 140, 0.3)',
                  color: '#A89B8C',
                },
              }}
            >
              Back
            </ActionButton>

            <Box display="flex" gap={2}>
              {activeStep === steps.length - 1 ? (
                <ActionButton
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? null : <Save />}
                  sx={{
                    background: 'linear-gradient(135deg, #D4A574 0%, #C49564 100%)',
                    color: '#fff',
                    minWidth: 160,
                  }}
                >
                  {isSubmitting ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        component="span"
                        sx={{
                          width: 16,
                          height: 16,
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
                      Publishing...
                    </Box>
                  ) : (
                    'Publish Product'
                  )}
                </ActionButton>
              ) : (
                <ActionButton
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForward />}
                  sx={{
                    background: 'linear-gradient(135deg, #D4A574 0%, #C49564 100%)',
                    color: '#fff',
                  }}
                >
                  Continue
                </ActionButton>
              )}
            </Box>
          </Box>
        </CardContent>
      </StyledCard>
    </Box>
  );
}