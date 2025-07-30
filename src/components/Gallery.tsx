'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Box,
  Container,
  Typography,
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
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import {
  Close,
  ZoomIn,
  ArrowBack,
  ArrowForward,
  FilterList,
  Star,
  CheckCircle,
} from '@mui/icons-material';
import Header from '@/components/Header';

// Gallery data for completed work - inspired by real customer projects
const galleryData = [
  // Car Seats
  {
    id: 1,
    title: 'Mercedes S-Class Interior',
    category: 'car',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    description: 'Complete luxury interior transformation with premium Nappa leather and diamond stitching',
    vehicle: 'Mercedes S-Class',
    completionTime: '2 weeks',
    rating: 5,
    features: ['Nappa Leather', 'Diamond Stitching', 'Heated/Cooled', 'Memory Function'],
    customerQuote: '"Absolutely stunning work! The quality is exceptional."',
  },
  {
    id: 2,
    title: 'Porsche 911 GT3 Seats',
    category: 'car',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    description: 'Racing-inspired seats with Alcantara inserts and red contrast stitching',
    vehicle: 'Porsche 911 GT3',
    completionTime: '1 week',
    rating: 5,
    features: ['Alcantara Inserts', 'Red Stitching', 'Racing Design', 'Safety Harness'],
    customerQuote: '"Perfect for track days and daily driving!"',
  },
  {
    id: 3,
    title: '1967 Mustang Restoration',
    category: 'car',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop',
    description: 'Period-correct restoration using authentic materials and hand-stitched details',
    vehicle: '1967 Ford Mustang',
    completionTime: '3 weeks',
    rating: 5,
    features: ['Period Correct', 'Hand Stitched', 'Vintage Leather', 'Authentic Design'],
    customerQuote: '"Brought my classic back to its original glory!"',
  },

  // Truck Seats
  {
    id: 4,
    title: 'Peterbilt 579 Driver Seat',
    category: 'truck',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=600&fit=crop',
    description: 'Professional driver seat with air suspension, lumbar support, and massage function',
    vehicle: 'Peterbilt 579',
    completionTime: '1 week',
    rating: 5,
    features: ['Air Suspension', 'Lumbar Support', 'Heating/Cooling', 'Massage Function'],
    customerQuote: '"Best investment for long hauls - my back thanks you!"',
  },
  {
    id: 5,
    title: 'Ford F-150 Platinum Interior',
    category: 'truck',
    image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop',
    description: 'Luxury truck interior with custom embroidery and premium leather',
    vehicle: 'Ford F-150 Platinum',
    completionTime: '2 weeks',
    rating: 5,
    features: ['Premium Leather', 'Custom Embroidery', 'Heated/Cooled', 'Storage Solutions'],
    customerQuote: '"Turned my work truck into a luxury vehicle!"',
  },
  {
    id: 6,
    title: 'Kenworth T680 Heavy Duty',
    category: 'truck',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=600&fit=crop',
    description: 'Heavy duty seating solution designed for maximum comfort and durability',
    vehicle: 'Kenworth T680',
    completionTime: '1 week',
    rating: 5,
    features: ['Heavy Duty', 'Durable Materials', 'Ergonomic Design', 'Easy Maintenance'],
    customerQuote: '"Built to last through the toughest conditions!"',
  },

  // Motorcycle Seats
  {
    id: 7,
    title: 'Harley Davidson Custom Seat',
    category: 'motorbike',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    description: 'Custom motorcycle seat with gel padding and personalized design',
    vehicle: 'Harley Davidson Street Glide',
    completionTime: '3 days',
    rating: 5,
    features: ['Gel Padding', 'Custom Design', 'Weather Resistant', 'Comfort Fit'],
    customerQuote: '"Finally comfortable on long rides!"',
  },
  {
    id: 8,
    title: 'Ducati Panigale V4 Seat',
    category: 'motorbike',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    description: 'Racing-inspired seat with lightweight materials and aerodynamic design',
    vehicle: 'Ducati Panigale V4',
    completionTime: '2 days',
    rating: 5,
    features: ['Racing Design', 'Lightweight', 'Grip Surface', 'Aerodynamic'],
    customerQuote: '"Perfect for track days and aggressive riding!"',
  },
  {
    id: 9,
    title: 'BMW R1250GS Adventure Seat',
    category: 'motorbike',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    description: 'Adventure touring seat with memory foam and heated elements',
    vehicle: 'BMW R1250GS Adventure',
    completionTime: '1 week',
    rating: 5,
    features: ['Memory Foam', 'Heated Elements', 'Adventure Design', 'Backrest'],
    customerQuote: '"Comfortable for 12-hour adventure rides!"',
  },

  // Marine Seats
  {
    id: 10,
    title: 'Luxury Yacht Captain Chair',
    category: 'ship',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    description: 'Luxury yacht captain chair with marine-grade materials and swivel base',
    vehicle: 'Luxury Yacht',
    completionTime: '2 weeks',
    rating: 5,
    features: ['Marine Grade', 'Salt Resistant', 'Swivel Base', 'Premium Leather'],
    customerQuote: '"Elegant and functional - perfect for our yacht!"',
  },
  {
    id: 11,
    title: 'Commercial Cargo Ship Bridge',
    category: 'ship',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    description: 'Commercial ship bridge seating designed for 24/7 operation',
    vehicle: 'Commercial Cargo Ship',
    completionTime: '3 weeks',
    rating: 5,
    features: ['Industrial Grade', 'Anti-Corrosion', 'Ergonomic', '24/7 Use'],
    customerQuote: '"Built for the toughest marine environments!"',
  },
  {
    id: 12,
    title: 'Commercial Fishing Boat Seats',
    category: 'ship',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    description: 'Commercial fishing boat seats designed for long hours on the water',
    vehicle: 'Commercial Fishing Boat',
    completionTime: '1 week',
    rating: 5,
    features: ['Water Resistant', 'Anti-Slip', 'Long Hours Comfort', 'Easy Clean'],
    customerQuote: '"Comfortable for 16-hour fishing trips!"',
  },
];

const categories = [
  { value: 'all', label: 'All Projects' },
  { value: 'car', label: 'Automotive' },
  { value: 'truck', label: 'Commercial Trucks' },
  { value: 'motorbike', label: 'Motorcycles' },
  { value: 'ship', label: 'Marine' },
];

const Gallery = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<typeof galleryData[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredImages = selectedCategory === 'all' 
    ? galleryData 
    : galleryData.filter(item => item.category === selectedCategory);

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        sx={{
          color: index < rating ? '#FFD700' : '#E0E0E0',
          fontSize: '1rem',
        }}
      />
    ));
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Header />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #9a0007 100%)',
          color: 'white',
          py: { xs: 6, md: 8 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 'bold',
              mb: 3,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Photo Gallery
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.9,
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Browse our gallery to see real customer projects featuring custom seats, stitched panels, and more. Get inspired for your next build.
          </Typography>
        </Container>
      </Box>

             {/* What We Do Section */}
       <Box sx={{ 
         backgroundColor: 'white', 
         py: { xs: 4, md: 6 },
         borderBottom: '1px solid #e0e0e0',
       }}>
         <Container maxWidth="lg">
           <Typography
             variant="h4"
             sx={{
               textAlign: 'center',
               fontWeight: 'bold',
               mb: 4,
               color: 'text.primary',
             }}
           >
             What We Do
           </Typography>
           <Box sx={{ 
             display: 'grid',
             gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
             gap: { xs: 3, md: 4 },
             justifyContent: 'center',
           }}>
             {[
               { title: 'Custom Seats', description: 'Tailored seating solutions for any vehicle' },
               { title: 'Stitched Panels', description: 'Professional upholstery and panel work' },
               { title: 'Embroidery', description: 'Custom logos and personalized designs' },
               { title: 'Restoration', description: 'Vintage and classic vehicle restoration' },
             ].map((service, index) => (
               <Box
                 key={index}
                 sx={{
                   textAlign: 'center',
                   p: 3,
                   borderRadius: 2,
                   backgroundColor: 'rgba(211, 47, 47, 0.05)',
                   transition: 'all 0.3s ease',
                   '&:hover': {
                     backgroundColor: 'rgba(211, 47, 47, 0.1)',
                     transform: 'translateY(-4px)',
                   },
                 }}
               >
                 <Typography
                   variant="h6"
                   sx={{
                     fontWeight: 'bold',
                     mb: 1,
                     color: 'primary.main',
                   }}
                 >
                   {service.title}
                 </Typography>
                 <Typography
                   variant="body2"
                   sx={{
                     color: 'text.secondary',
                     lineHeight: 1.5,
                   }}
                 >
                   {service.description}
                 </Typography>
               </Box>
             ))}
           </Box>
         </Container>
       </Box>

       {/* Filter Tabs */}
       <Box sx={{ 
         backgroundColor: 'white', 
         borderBottom: '1px solid #e0e0e0',
         position: 'sticky',
         top: 0,
         zIndex: 10,
       }}>
        <Container maxWidth="lg">
          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minWidth: 120,
                fontSize: '0.9rem',
                fontWeight: 500,
                textTransform: 'none',
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'primary.main',
                  fontWeight: 600,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main',
                height: 3,
              },
            }}
          >
            {categories.map((category) => (
              <Tab
                key={category.value}
                value={category.value}
                label={category.label}
                icon={<FilterList sx={{ fontSize: '1rem', mr: 1 }} />}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Container>
      </Box>

      {/* Gallery Grid */}
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: { xs: 3, md: 4 },
            justifyContent: 'center',
            width: '100%'
          }}>
            {filteredImages.map((item, index) => (
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
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(211, 47, 47, 0.25)',
                      '& .zoom-icon': {
                        opacity: 1,
                      },
                      '& .card-media': {
                        transform: 'scale(1.05)',
                      },
                    },
                  }}
                  onClick={() => handleImageClick(item, index)}
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
                        objectFit: 'cover',
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
                        p: 1,
                        color: 'white',
                      }}
                    >
                      <ZoomIn />
                    </Box>
                    <Chip
                      label={item.vehicle}
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                      }}
                    >
                      {renderStars(item.rating)}
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        mb: 1,
                        fontSize: '1.1rem',
                        color: 'text.primary',
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
                      }}
                    >
                      {item.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip
                        label={`${item.completionTime}`}
                        size="small"
                        sx={{
                          backgroundColor: 'success.main',
                          color: 'white',
                          fontSize: '0.7rem',
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {renderStars(item.rating)}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {item.features.slice(0, 2).map((feature, idx) => (
                        <Chip
                          key={idx}
                          label={feature}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.7rem',
                            borderColor: 'primary.main',
                            color: 'primary.main',
                          }}
                        />
                      ))}
                      {item.features.length > 2 && (
                        <Chip
                          label={`+${item.features.length - 2} more`}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.7rem',
                            borderColor: 'text.secondary',
                            color: 'text.secondary',
                          }}
                        />
                      )}
                    </Box>
                                         {item.customerQuote && (
                       <Typography
                         variant="body2"
                         sx={{
                           fontStyle: 'italic',
                           color: 'text.secondary',
                           fontSize: '0.8rem',
                           mb: 2,
                           textAlign: 'center',
                           backgroundColor: 'rgba(211, 47, 47, 0.05)',
                           p: 1,
                           borderRadius: 1,
                         }}
                       >
                         {item.customerQuote}
                       </Typography>
                     )}
                     <Button
                       variant="outlined"
                       size="small"
                       fullWidth
                       sx={{
                         borderColor: 'primary.main',
                         color: 'primary.main',
                         '&:hover': {
                           backgroundColor: 'primary.main',
                           color: 'white',
                         },
                       }}
                     >
                       View Project Details
                     </Button>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>

          {filteredImages.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" sx={{ color: 'text.secondary', mb: 2 }}>
                No projects found for this category
              </Typography>
              <Button
                variant="contained"
                onClick={() => setSelectedCategory('all')}
                sx={{ backgroundColor: 'primary.main' }}
              >
                View All Projects
              </Button>
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
            backgroundColor: 'rgba(0,0,0,0.95)',
            color: 'white',
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={handleCloseLightbox}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)',
              },
            }}
          >
            <Close />
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
                  maxHeight: '80vh',
                  objectFit: 'contain',
                }}
              />
              
              {/* Navigation Arrows */}
              <IconButton
                onClick={handlePrevImage}
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                  },
                }}
              >
                <ArrowBack />
              </IconButton>
              
              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                  },
                }}
              >
                <ArrowForward />
              </IconButton>

              {/* Project Info */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                  p: 3,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {selectedImage.title}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                  {selectedImage.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Chip
                    label={selectedImage.vehicle}
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                  <Chip
                    label={`${selectedImage.completionTime}`}
                    sx={{
                      backgroundColor: 'success.main',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {renderStars(selectedImage.rating)}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedImage.features.map((feature, idx) => (
                    <Chip
                      key={idx}
                      label={feature}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontSize: '0.8rem',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          )}
                 </DialogContent>
       </Dialog>

       {/* Call to Action Section */}
       <Box sx={{ 
         backgroundColor: 'primary.main', 
         color: 'white',
         py: { xs: 6, md: 8 },
       }}>
         <Container maxWidth="lg">
           <Box sx={{ textAlign: 'center' }}>
             <Typography
               variant="h3"
               sx={{
                 fontWeight: 'bold',
                 mb: 3,
                 fontSize: { xs: '2rem', md: '3rem' },
               }}
             >
               Ready to Start Your Project?
             </Typography>
             <Typography
               variant="h6"
               sx={{
                 mb: 4,
                 opacity: 0.9,
                 maxWidth: 600,
                 mx: 'auto',
                 lineHeight: 1.6,
               }}
             >
               Get inspired by our gallery and let us bring your vision to life. Contact us for a custom quote today.
             </Typography>
             <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
               <Button
                 variant="contained"
                 size="large"
                 sx={{
                   backgroundColor: 'white',
                   color: 'primary.main',
                   px: 4,
                   py: 1.5,
                   fontSize: '1.1rem',
                   fontWeight: 'bold',
                   '&:hover': {
                     backgroundColor: 'rgba(255,255,255,0.9)',
                   },
                 }}
               >
                 Get a Quote
               </Button>
               <Button
                 variant="outlined"
                 size="large"
                 sx={{
                   borderColor: 'white',
                   color: 'white',
                   px: 4,
                   py: 1.5,
                   fontSize: '1.1rem',
                   fontWeight: 'bold',
                   '&:hover': {
                     backgroundColor: 'rgba(255,255,255,0.1)',
                   },
                 }}
               >
                 Contact Us
               </Button>
             </Box>
           </Box>
         </Container>
       </Box>
     </Box>
   );
 };

export default Gallery; 