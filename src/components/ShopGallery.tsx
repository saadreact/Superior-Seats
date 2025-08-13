'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import {
  Close,
  ZoomIn,
  ArrowBack,
  ArrowForward,
  FilterList,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';
import Header from '@/components/Header';
import HeroSectionCommon from '@/components/common/HeroSectionaCommon';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { mainCategories, subCategories, galleryData } from '@/data/ShopGallery';
// NEW IMPORTS: Added to enable communication with CustomizedSeat component
import { useSelectedItem } from '@/contexts/SelectedItemContext'; // Context hook to set selected item data
import { useRouter } from 'next/navigation'; // Next.js router for programmatic navigation
import { useDispatch } from 'react-redux';
import { addItem } from '@/store/cartSlice';

const ShopGallery = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  // NEW CONTEXT USAGE: Access functions to set selected item and navigate
  const { setSelectedItem } = useSelectedItem(); // Destructure setSelectedItem from context
  const router = useRouter(); // Initialize Next.js router for navigation
  
  const [selectedMainCategory, setSelectedMainCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<typeof galleryData[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);   // cards per page

  // Filter images based on selected categories
  const filteredImages = galleryData.filter(item => {
    if (selectedMainCategory === 'all') {
      return true; // Show all products
    }
    
    if (item.mainCategory !== selectedMainCategory) {
      return false; // Filter by main category
    }
    
    if (selectedSubCategory === 'all' || selectedSubCategory.startsWith('all-')) {
      return true; // Show all sub-categories for the selected main category
    }
    
    return item.subCategory === selectedSubCategory;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredImages.slice(startIndex, endIndex);

  // Get available sub-categories for the selected main category
  const availableSubCategories = selectedMainCategory === 'all' 
    ? [] 
    : subCategories[selectedMainCategory as keyof typeof subCategories] || [];

  const handleMainCategoryChange = (event: any) => {
    const newMainCategory = event.target.value;
    setSelectedMainCategory(newMainCategory);
    
    // Auto-select the appropriate "all" sub-category based on the main category
    if (newMainCategory === 'seats') {
      setSelectedSubCategory('all-seats');
    } else if (newMainCategory === 'spare-parts') {
      setSelectedSubCategory('all-spare-parts');
    } else if (newMainCategory === 'accessories') {
      setSelectedSubCategory('all-accessories');
    } else {
      setSelectedSubCategory('all'); // For 'all' main category
    }
    
    setCurrentPage(1); // Reset to first page
  };

  const handleSubCategoryChange = (event: any) => {
    setSelectedSubCategory(event.target.value);
    setCurrentPage(1); // Reset to first page when sub-category changes
  };

  const handleImageClick = (image: typeof galleryData[0], index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedImage(null);
  };

  const handleNextImage = () => {
    const nextIndex = (currentImageIndex + 1) % filteredImages.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(filteredImages[nextIndex]);
  };

  const handlePrevImage = () => {
    const prevIndex = currentImageIndex === 0 ? filteredImages.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(filteredImages[prevIndex]);
  };

  const handleAddToCart = (item: typeof galleryData[0]) => {
    dispatch(addItem({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      description: item.description,
      category: item.category,
    }));
  };

  // NEW FUNCTION: Handles item selection and navigation to customization page
  const handleCustomize = (item: typeof galleryData[0]) => {
    setSelectedItem({ // FUNCTION: Set the selected item in global context
      id: item.id,
      title: item.title,
      category: item.category,
      subCategory: item.subCategory,
      mainCategory: item.mainCategory,
      image: item.image,
      description: item.description,
      price: item.price,
    });
    router.push('/customize-your-seat'); // FUNCTION: Navigate to customization page
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Header />
      
             {/* Hero Section */}
       <HeroSectionCommon
         title="Shop Specials"
         description="Discover our exclusive collection of premium seats with special pricing and unique features"
         height={{
          xs: '18vh',
          sm: '20vh',
          md: '18vh',
          lg: '20vh'
         }}
       />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Category Dropdown Filter - HIDDEN FOR NOW */}
      {/* 
      <Box sx={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e0e0e0',
        position: 'sticky',
        top: { xs: '56px', sm: '64px', md: '64px' },
        zIndex: 10,
        py: { xs: 0.5, sm: 1, md: 1.5, lg: 1 },
        px: { xs: 0.5, sm: 1, md: 2, lg: 3 },
        mt: 0,
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 1.5, md: 2, lg: 3 },
            flexWrap: 'wrap',
            flexDirection: { xs: 'column', sm: 'row' },
          }}>
         
            
            <FormControl 
              sx={{ 
                minWidth: { xs: '100%', sm: '140px', md: '160px', lg: '180px' },
                width: { xs: '100%', sm: 'auto' },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  height: { xs: '32px', sm: '36px', md: '40px', lg: '44px' },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                  },
                },
                '& .MuiSelect-select': {
                  fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem', lg: '1rem' },
                  fontWeight: 500,
                  color: 'text.primary',
                  py: { xs: 0.25, sm: 0.375, md: 0.7, lg: 0.7 },
                },
              }}
            >
              <InputLabel 
                id="main-category-select-label"
                sx={{ 
                  fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.875rem' },
                  fontWeight: 500,
                  color: 'text.secondary',
                }}
              >
                Main Category
              </InputLabel>
              <Select
                labelId="main-category-select-label"
                id="main-category-select"
                value={selectedMainCategory}
                label="Main Category"
                onChange={handleMainCategoryChange}
                startAdornment={
                  <FilterList 
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem' }, 
                      mr: 1,
                      color: 'primary.main'
                    }} 
                  />
                }
              >
                {mainCategories.map((category) => (
                  <MenuItem 
                    key={category.value} 
                    value={category.value}
                    sx={{
                      fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.875rem' },
                      fontWeight: category.value === selectedMainCategory ? 600 : 400,
                      color: category.value === selectedMainCategory ? 'primary.main' : 'text.primary',
                      '&:hover': {
                        backgroundColor: 'rgba(211, 47, 47, 0.08)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(211, 47, 47, 0.12)',
                        '&:hover': {
                          backgroundColor: 'rgba(211, 47, 47, 0.16)',
                        },
                      },
                    }}
                  >
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedMainCategory !== 'all' && availableSubCategories.length > 0 && (
              <FormControl 
                sx={{ 
                  minWidth: { xs: '100%', sm: '140px', md: '160px', lg: '180px' },
                  width: { xs: '100%', sm: 'auto' },
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    height: { xs: '32px', sm: '36px', md: '40px', lg: '44px' },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiSelect-select': {
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem', lg: '1rem' },
                    fontWeight: 500,
                    color: 'text.primary',
                    py: { xs: 0.25, sm: 0.375, md: 0.7, lg: 0.7 },
                
                  },
                }}
              >
                <InputLabel 
                  id="sub-category-select-label"
                  sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.875rem' },
                    fontWeight: 500,
                    color: 'text.secondary',
                  }}
                >
                  Sub Category
                </InputLabel>
                <Select
                  labelId="sub-category-select-label"
                  id="sub-category-select"
                  value={selectedSubCategory}
                  label="Sub Category"
                  onChange={handleSubCategoryChange}
                  startAdornment={
                    <FilterList 
                      sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem' }, 
                        mr: 1,
                        color: 'primary.main'
                      }} 
                    />
                  }
                >
                  {availableSubCategories.map((category) => (
                    <MenuItem 
                      key={category.value} 
                      value={category.value}
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.875rem' },
                        fontWeight: category.value === selectedSubCategory ? 600 : 400,
                        color: category.value === selectedSubCategory ? 'primary.main' : 'text.primary',
                        '&:hover': {
                          backgroundColor: 'rgba(211, 47, 47, 0.08)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(211, 47, 47, 0.12)',
                          '&:hover': {
                            backgroundColor: 'rgba(211, 47, 47, 0.16)',
                          },
                        },
                      }}
                    >
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </Container>
      </Box>
      */}

      {/* Gallery Grid */}
      <Box sx={{ py: { xs: 1, sm: 1.5, md: 2, lg: 2 }, px: { xs: 1, sm: 2, md: 3 } }}>
        <Container maxWidth="lg">
          {/* Gallery Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: { xs: 2, sm: 3, md: 4 },
            flexWrap: 'wrap',
            gap: { xs: 1, sm: 0 },
            flexDirection: { xs: 'column', sm: 'row' },
          }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem', lg: '1.75rem' },
                textAlign: { xs: 'center', sm: 'left' },
                width: { xs: '100%', sm: 'auto' },
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              {selectedMainCategory === 'all' 
                ? 'All Products' 
                : selectedSubCategory === 'all' || selectedSubCategory.startsWith('all-')
                  ? mainCategories.find(cat => cat.value === selectedMainCategory)?.label
                  : availableSubCategories.find(cat => cat.value === selectedSubCategory)?.label || 'Products'
              }
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                textAlign: { xs: 'center', sm: 'right' },
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {filteredImages.length} product{filteredImages.length !== 1 ? 's' : ''} found
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: { xs: 1.5, sm: 2, md: 3, lg: 4 },
            justifyContent: 'center',
            width: '100%'
          }}>
            {currentItems.map((item, index) => (
              <Box key={item.id} sx={{ width: '100%' }}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    '&:hover': {
                      transform: { xs: 'none', sm: 'translateY(-8px)' },
                      boxShadow: { xs: '0 4px 20px rgba(0,0,0,0.1)', sm: '0 12px 40px rgba(211, 47, 47, 0.25)' },
                      '& .zoom-icon': {
                        opacity: 1,
                      },
                      '& .card-media': {
                        transform: { xs: 'none', sm: 'scale(1.05)' },
                      },
                    },
                  }}
                  onClick={() => handleImageClick(item, startIndex + index)}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="250"
                      image={item.image}
                      alt={item.title}
                      className="card-media"
                      sx={{
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        objectFit: 'contain',
                        width: '100%',
                        height: { xs: '180px', sm: '200px', md: '220px', lg: '250px' },
                        backgroundColor: '#f5f5f5',
                      }}
                    />
                    <Box
                      className="zoom-icon"
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        backgroundColor: 'rgba(211, 47, 47, 0.9)',
                        borderRadius: '50%',
                        p: { xs: 0.5, sm: 1 },
                        color: 'white',
                        display: { xs: 'none', sm: 'flex' },
                      }}
                    >
                      <ZoomIn sx={{ fontSize: { xs: 18, sm: 24 } }} />
                    </Box>
                    <Chip
                      label={item.price}
                      sx={{
                        position: 'absolute',
                        top: { xs: 8, sm: 12, md: 16 },
                        right: { xs: 8, sm: 12, md: 16 },
                        backgroundColor: 'primary.main',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                        height: { xs: 20, sm: 24, md: 28, lg: 32 },
                        '& .MuiChip-label': {
                          px: { xs: 1, sm: 1.5 },
                        },
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2, md: 2.5, lg: 3 } }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        mb: 1,
                        fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' },
                        color: 'text.primary',
                        lineHeight: { xs: 1.3, sm: 1.4 },
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.5,
                        mb: 2,
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                        display: { xs: '-webkit-box', sm: 'block' },
                        WebkitLineClamp: { xs: 2, sm: 'none' },
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                      }}
                    >
                      {item.description}
                    </Typography>
                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }} 
                      spacing={{ xs: 1, sm: 1 }}
                      sx={{ flexWrap: 'wrap', gap: { xs: 1, sm: 1 } }}
                    >
                      {/* MODIFIED BUTTON: Changed from "View Details" to "Customize" with new functionality */}
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation(); // PREVENT: Stop card click event from firing
                          handleCustomize(item); // FUNCTION: Call the new customize handler
                        }}
                        sx={{
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                          py: { xs: 0.5, sm: 0.75, md: 1 },
                          px: { xs: 1, sm: 1.5, md: 2 },
                          '&:hover': {
                            backgroundColor: 'primary.main',
                            color: 'white',
                          },
                        }}
                      >
                        Customize {/* TEXT: Changed button text from "View Details" */}
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                        sx={{
                          backgroundColor: 'primary.main',
                          color: 'white',
                          fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                          py: { xs: 0.5, sm: 0.75, md: 1 },
                          px: { xs: 1, sm: 1.5, md: 2 },
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          },
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>

          {filteredImages.length === 0 && (
            <Box sx={{ textAlign: 'center', py: { xs: 4, sm: 6, md: 8 } }}>
              <Typography variant="h5" sx={{ 
                color: 'text.secondary', 
                mb: 2,
                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}>
                No products found for this category
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  setSelectedMainCategory('all');
                  setSelectedSubCategory('all');
                }}
                sx={{ 
                  backgroundColor: 'primary.main',
                  fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                  px: { xs: 2, sm: 3, md: 4 },
                  py: { xs: 0.75, sm: 1, md: 1.5 },
                }}
              >
                View All Products
              </Button>
            </Box>
          )}

          {totalPages > 1 && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: { xs: 3, sm: 4, md: 5 },
              gap: { xs: 2, sm: 0 }
            }}>
              {/* Pagination Info */}
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                  textAlign: { xs: 'center', sm: 'left' },
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Showing {startIndex + 1} to {Math.min(endIndex, filteredImages.length)} of {filteredImages.length} products
              </Typography>

              {/* Pagination Controls */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                flexDirection: { xs: 'column', sm: 'row' },
                width: { xs: '100%', sm: 'auto' },
              }}>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange({} as any, currentPage - 1)}
                  startIcon={<KeyboardArrowLeft />}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                    '&:disabled': {
                      borderColor: 'grey.300',
                      color: 'grey.400',
                    },
                  }}
                >
                  Previous
                </Button>
                
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="small"
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                      minWidth: { xs: 32, sm: 40 },
                      height: { xs: 32, sm: 40 },
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      },
                    },
                  }}
                />
                
                <Button
                  variant="outlined"
                  size="small"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange({} as any, currentPage + 1)}
                  endIcon={<KeyboardArrowRight />}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                    '&:disabled': {
                      borderColor: 'grey.300',
                      color: 'grey.400',
                    },
                  }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          )}
        </Container>
      </Box>

      {/* Lightbox Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseLightbox}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            color: 'black',
            margin: { xs: 1, sm: 2, md: 4 },
            maxWidth: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 32px)', md: 'calc(100% - 64px)' },
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={handleCloseLightbox}
            sx={{
              position: 'absolute',
              top: { xs: 8, sm: 12, md: 16 },
              right: { xs: 8, sm: 12, md: 16 },
              color: 'white',
              backgroundColor: 'primary.main',
              zIndex: 1,
              boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
              width: { xs: 28, sm: 32, md: 40 },
              height: { xs: 28, sm: 32, md: 40 },
              '&:hover': {
                backgroundColor: 'primary.dark',
                boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <Close sx={{ fontSize: { xs: 16, sm: 18, md: 24 } }} />
          </IconButton>

          {selectedImage && (
            <Box sx={{ position: 'relative' }}>
              <Image
                src={selectedImage.image}
                alt={selectedImage.title}
                width={800}
                height={600}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: isSmallMobile ? '50vh' : isMobile ? '60vh' : '80vh',
                  objectFit: 'contain',
                }}
              />
              
              {/* Navigation Arrows */}
                             <IconButton
                 onClick={handlePrevImage}
                 sx={{
                   position: 'absolute',
                   left: { xs: 16, sm: 24, md: 32 },
                   top: '50%',
                   transform: 'translateY(-50%)',
                   color: 'white',
                   backgroundColor: 'primary.main',
                   boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                   width: { xs: 28, sm: 32, md: 40 },
                   height: { xs: 28, sm: 32, md: 40 },
                   display: { xs: 'none', sm: 'flex' },
                   '&:hover': {
                     backgroundColor: 'primary.dark',
                     boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
                     transform: 'translateY(-50%) scale(1.1)',
                   },
                   transition: 'all 0.2s ease',
                 }}
               >
                 <ArrowBack sx={{ fontSize: { xs: 16, sm: 18, md: 24 } }} />
               </IconButton>
               
               <IconButton
                 onClick={handleNextImage}
                 sx={{
                   position: 'absolute',
                   right: { xs: 16, sm: 24, md: 32 },
                   top: '50%',
                   transform: 'translateY(-50%)',
                   color: 'white',
                   backgroundColor: 'primary.main',
                   boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                   width: { xs: 28, sm: 32, md: 40 },
                   height: { xs: 28, sm: 32, md: 40 },
                   display: { xs: 'none', sm: 'flex' },
                   '&:hover': {
                     backgroundColor: 'primary.dark',
                     boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
                     transform: 'translateY(-50%) scale(1.1)',
                   },
                   transition: 'all 0.2s ease',
                 }}
               >
                 <ArrowForward sx={{ fontSize: { xs: 16, sm: 18, md: 24 } }} />
               </IconButton>

              {/* Image Info */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(255,255,255,0.9))',
                  p: { xs: 1.5, sm: 2, md: 3 },
                }}
              >
                <Typography variant="h5" sx={{ 
                  fontWeight: 'bold', 
                  mb: 1,
                  fontSize: { xs: '1rem', sm: '1.125rem', md: '1.5rem' },
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}>
                  {selectedImage.title}
                </Typography>
                <Typography variant="body1" sx={{ 
                  mb: 2, 
                  opacity: 0.9,
                  fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                  display: { xs: '-webkit-box', sm: 'block' },
                  WebkitLineClamp: { xs: 2, sm: 'none' },
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}>
                  {selectedImage.description}
                </Typography>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={{ xs: 1, sm: 2 }} 
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  sx={{ flexWrap: 'wrap' }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    disabled
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                      px: { xs: 1, sm: 1.5, md: 2 },
                      py: { xs: 0.5, sm: 0.75, md: 1 },
                      minWidth: { xs: '80px', sm: '90px', md: '100px' },
                      '&:hover': {
                        backgroundColor: 'primary.main',
                      },
                      '&.Mui-disabled': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        opacity: 1,
                      },
                    }}
                  >
                    {selectedImage.price}
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      handleAddToCart(selectedImage);
                      handleCloseLightbox();
                    }}
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                      px: { xs: 1, sm: 1.5, md: 2 },
                      py: { xs: 0.5, sm: 0.75, md: 1 },
                      minWidth: { xs: '80px', sm: '90px', md: '100px' },
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    Add to Cart
                  </Button>
                </Stack>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </Box>
  );
};

export default ShopGallery; 