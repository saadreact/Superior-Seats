'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Chip,
  Alert,
  useTheme,
} from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroSectionCommon from '@/components/common/HeroSectionaCommon';

import { motion } from 'framer-motion';
import { Security, Build, Warning, CheckCircle, Schedule, Shield } from '@mui/icons-material';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);
const MotionPaper = motion.create(Paper);

const Warranty = () => {
  const theme = useTheme();

  const warrantyTypes = [
    {
      type: 'Standard Seating',
      duration: '3 Years',
      description: 'Class 8, pickups, vans, and RVs. Covers manufacturing defects and material failures. Includes manufacturing defects, material failures, structural issues, and stitching problems.',
      icon: <CheckCircle />
    },
    {
      type: 'Integrated Seat Belt System',
      duration: '2 Years',
      description: 'Seats with integrated seat belt systems. Comprehensive coverage for safety components and structural integrity.',
      icon: <Security />
    },
    {
      type: 'Cushions, Sofas & Limousine',
      duration: '1 Year',
      description: 'Cushions, sofas, jackknifes and limousine seating. Covers manufacturing defects and material failures.',
      icon: <Shield />
    },
    {
      type: 'Transit & Shuttle Seating',
      duration: '1 Year',
      description: 'Transit and Shuttle seating systems. Standard coverage for commercial vehicle seating applications.',
      icon: <Build />
    }
  ];

  const warrantyExclusions = [
    'The process for enacting the Warranty is to contact Superior Seating about the part in question as soon as possible. We will require clear pictures of the damage or defect. After warranty is considered, we will ship out the part as soon as it is available or make other arrangements for the replacement or repair of the damage or defect, at our discretion.  Superior Seating will pay the costs of shipping associated with the repair or replacement.'
  ];

  const warrantyProcess = [
    {
      step: '1',
      title: 'Contact Support',
      description: 'Reach out to our warranty team with your issue',
      icon: <CheckCircle />
    },
    {
      step: '2',
      title: 'Document Issue',
      description: 'Provide photos and detailed description of the problem',
      icon: <Security />
    },
    {
      step: '3',
      title: 'Assessment',
      description: 'Our team will review and determine coverage',
      icon: <Build />
    },
    {
      step: '4',
      title: 'Resolution',
      description: 'We\'ll repair, replace, or provide appropriate solution',
      icon: <Schedule />
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <HeroSectionCommon
        title="Warranty"
        description="We stand behind the quality of our custom seating solutions with comprehensive warranty coverage."
        height={{
          xs: '75px',
          sm: '70px', 
          md: '80px',
          lg: '95px',
          xl: '105px',
          xxl: '115px'
        }}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      <Box sx={{ 
        flex: 1, 
        py: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2 } 
      }}>
        <Container maxWidth="lg">
          <MotionBox
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >

            {/* Mission Statement */}
            <MotionPaper
              variants={itemVariants}
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                backgroundColor: 'background.paper',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.05)',
                mb: { xs: 3, sm: 4, md: 5 },
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  textAlign: 'center', 
                  fontWeight: 'bold', 
                  mb: { xs: 2, sm: 2.5, md: 3 },
                  fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                  color: 'black',
                }}
              >
                Our Mission Statement
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  color: 'text.secondary',
                  fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' },
                  fontWeight: 400,
                  textAlign: 'justify',
                  maxWidth: '100%',
                  px: { xs: 1, sm: 2 },
                  whiteSpace: 'normal',
                  overflow: 'visible',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                  textJustify: 'inter-word',
                  letterSpacing: '0.01em',
                  mb: 3,
                }}
              >
                Superior Seating Inc. is dedicated to exceeding the expectations of our customers and to achieving the most respected reputation in the Custom Seating industry by maintaining the highest level of Integrity, Quality and Service.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  color: 'text.secondary',
                  fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' },
                  fontWeight: 400,
                  textAlign: 'justify',
                  maxWidth: '100%',
                  px: { xs: 1, sm: 2 },
                  whiteSpace: 'normal',
                  overflow: 'visible',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                  textJustify: 'inter-word',
                  letterSpacing: '0.01em',
                }}
              >
                As a leader in our industry and in our community, we are committed to growing and adapting to our customer&apos;s needs and the changing custom seating and retail environments.
              </Typography>
            </MotionPaper>

            {/* Content */}
            <MotionPaper
              variants={itemVariants}
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                backgroundColor: 'background.paper',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              {warrantyTypes.map((warranty, index) => (
                <MotionBox
                  key={index}
                  variants={itemVariants}
                  sx={{ gap: { xs: 1, sm: 1.5 , lg: 2,xl: 2.5},mb: index < warrantyTypes.length - 1 ? { xs: 2, sm: 2.5 } : 0 }}
                >
                                                           <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: { xs: 1.5, sm: 2 },
                          width: '100%',
                          gap: { xs: 0.5, sm: 1 },
                        }}
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 'bold',
                            color: 'black',
                            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                            textAlign: 'center',
                            letterSpacing: '-0.01em',
                            lineHeight: 1.3,
                            
                          }}
                        >
                          {warranty.type}
                        </Typography>
                        <Chip
                          label={warranty.duration}
                          sx={{
                            backgroundColor: '#DA291C',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' },
                            height: { xs: '24px', sm: '28px', md: '32px' },
                            minWidth: { xs: '60px', sm: '70px', md: '80px' },
                            ml: { xs: 1, sm: 1.5, md: 2, lg: 2 },
                          }}
                        />
                      </Box>
                  
                  <Box 
                    sx={{ 
                      m: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: { xs: 1, sm: 1.5 },
                    }}
                  >
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               <Typography
                           variant="body1"
                           sx={{
                             lineHeight: 1.6,
                             color: 'text.secondary',
                             fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem', lg: '1rem' },
                             fontWeight: 400,
                             textAlign: 'justify',
                             maxWidth: '100%',
                             px: { xs: 1, sm: 2 },
                             whiteSpace: 'normal',
                             overflow: 'visible',
                             wordWrap: 'break-word',
                             overflowWrap: 'break-word',
                             hyphens: 'auto',
                             textJustify: 'inter-word',
                             letterSpacing: '0.01em',
                           }}
                         >
                           {warranty.description}
                         </Typography>
                    
                    
                  </Box>
                  
                  {index < warrantyTypes.length - 1 && (
                    <Divider 
                      sx={{ 
                        mt: { xs: 2, sm: 2.5 }, 
                        mb: { xs: 2, sm: 2.5 },
                        borderColor: 'rgba(218, 41, 28, 0.2)',
                        borderWidth: 1,
                      }} 
                    />
                  )}
                </MotionBox>
              ))}
                         </MotionPaper>

             {/* Warranty Covers */}
             <MotionBox variants={itemVariants} sx={{ mt: { xs: 3, sm: 4, md: 5 } }}>
               <Typography 
                 variant="h4" 
                 sx={{ 
                   textAlign: 'center', 
                   fontWeight: 'bold', 
                   mb: { xs: 2, sm: 2.5, md: 3 },
                   fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                   color: 'black',
                 }}
               >
                 Warranty Covers
               </Typography>
               <MotionPaper
                 variants={itemVariants}
                 sx={{
                   p: { xs: 2, sm: 3, md: 4 },
                   backgroundColor: 'background.paper',
                   boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                   borderRadius: 2,
                   border: '1px solid rgba(0,0,0,0.05)',
                 }}
               >
                 <Typography
                   variant="body1"
                   sx={{
                     lineHeight: 1.8,
                     color: 'text.secondary',
                     fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' },
                     fontWeight: 400,
                     textAlign: 'justify',
                     maxWidth: '100%',
                     px: { xs: 1, sm: 2 },
                     whiteSpace: 'normal',
                     overflow: 'visible',
                     wordWrap: 'break-word',
                     overflowWrap: 'break-word',
                     hyphens: 'auto',
                     textJustify: 'inter-word',
                     letterSpacing: '0.01em',
                     mb: 3,
                   }}
                 >
                   The Warranty covers seat frames, seat foam, and manufacturing defects. The Warranty does not replace or repair damages resulting from customer abuse or normal wear and tear.
                 </Typography>
                 
                                   <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.8,
                      color: 'text.secondary',
                      fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' },
                      fontWeight: 400,
                      textAlign: 'justify',
                      maxWidth: '100%',
                      px: { xs: 1, sm: 2 },
                      whiteSpace: 'normal',
                      overflow: 'visible',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto',
                      textJustify: 'inter-word',
                      letterSpacing: '0.01em',
                      mb: 3,
                    }}
                  >
                    Customer abuse is defined as excessive pushing, pulling, or climbing on seat arms, damage to the fabric caused by customer actions, and damage caused by any attempts to tamper with the construction of the seat.
                  </Typography>
                  
                  <Typography
                    variant="h4"
                    sx={{
                      lineHeight: 1.8,
                      color: 'black',
                      fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' },
                      fontWeight: 'bold',
                      textAlign: 'center',
                      maxWidth: '100%',
                      px: { xs: 1, sm: 2 },
                      whiteSpace: 'normal',
                      overflow: 'visible',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      letterSpacing: '0.02em',
                      borderTop: '1px solid rgba(0,0,0,0.1)',
                      pt: 2,
                      mb: 2,
                    }}
                  >
                    Please Note:
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.8,
                      color: 'text.secondary',
                      fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' },
                      fontWeight: 400,
                      textAlign: 'justify',
                      maxWidth: '100%',
                      px: { xs: 1, sm: 2 },
                      whiteSpace: 'normal',
                      overflow: 'visible',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto',
                      textJustify: 'inter-word',
                      letterSpacing: '0.01em',
                      mb: 2,
                    }}
                  >
                    Any dismantling or removal of materials or parts from your seat will void your warranty.
                  </Typography>
                  
                                     <Typography
                     variant="body1"
                     sx={{
                       lineHeight: 1.8,
                       color: 'text.secondary',
                       fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' },
                       fontWeight: 400,
                       textAlign: 'justify',
                       maxWidth: '100%',
                       px: { xs: 1, sm: 2 },
                       whiteSpace: 'normal',
                       overflow: 'visible',
                       wordWrap: 'break-word',
                       overflowWrap: 'break-word',
                       hyphens: 'auto',
                       textJustify: 'inter-word',
                       letterSpacing: '0.01em',
                     }}
                   >
                     If any parts are defective, missing, or damaged, please contact us within{' '}
                     <Box
                       component="span"
                       sx={{
                         color: '#DA291C',
                         fontWeight: 'bold',
                         backgroundColor: 'rgba(218, 41, 28, 0.1)',
                         px: 0.5,
                         borderRadius: 0.5,
                         border: '1px solid rgba(218, 41, 28, 0.2)',
                       }}
                     >
                       5 days
                     </Box>
                     {' '}of receipt for replacement or repair instructions.
                   </Typography>
               </MotionPaper>
             </MotionBox>

             {/* Warranty Process */}
            <MotionBox variants={itemVariants} sx={{ mt: { xs: 3, sm: 4, md: 5 } }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  textAlign: 'center', 
                  fontWeight: 'bold', 
                  mb: { xs: 2, sm: 2.5, md: 3 },
                  fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                  color: 'black',
                }}
              >
                Warranty Process
              </Typography>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: { xs: 1.5, sm: 2, md: 3 },
                mt: { xs: 2, sm: 3 },
              }}>
                {warrantyProcess.map((step, index) => (
                  <MotionBox
                    key={index}
                    variants={itemVariants}
                    sx={{
                      textAlign: 'center',
                      p: { xs: 1.5, sm: 2 },
                      backgroundColor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      border: '1px solid rgba(0,0,0,0.05)',
                    }}
                  >
                    <Box sx={{ 
                      color: '#DA291C', 
                      mb: { xs: 0.5, sm: 1 },
                      fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                    }}>
                      {step.icon}
                    </Box>
                                         <Typography 
                       variant="h6" 
                       sx={{ 
                         fontWeight: 'bold',
                         fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                         mb: { xs: 0.5, sm: 1 },
                         color: 'black',
                       }}
                     >
                       {step.title}
                     </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' },
                        color: 'text.secondary',
                        lineHeight: { xs: 1.2, sm: 1.4, md: 1.6 },
                      }}
                    >
                      {step.description}
                    </Typography>
                  </MotionBox>
                ))}
              </Box>
            </MotionBox>

                         {/* Warranty Exclusions */}
             <MotionBox variants={itemVariants} sx={{ mt: { xs: 3, sm: 4, md: 5 } }}>
                               <Typography 
                  variant="h4" 
                  sx={{ 
                    textAlign: 'center', 
                    fontWeight: 'bold', 
                    mb: { xs: 2, sm: 2.5, md: 3 },
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                    color: 'black',
                  }}
                >
                  Please Note
                </Typography>
               <MotionPaper
                 variants={itemVariants}
                 sx={{
                   p: { xs: 2, sm: 3, md: 4 },
                   backgroundColor: 'background.paper',
                   boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                   borderRadius: 2,
                   border: '1px solid rgba(0,0,0,0.05)',
                 }}
               >
                                   <Typography
                    variant="body2"
                    sx={{
                      lineHeight: 1.6,
                      color: 'text.secondary',
                      fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem', lg: '1rem' },
                      fontWeight: 400,
                      textAlign: 'justify',
                      maxWidth: '100%',
                      px: { xs: 1, sm: 2 },
                      whiteSpace: 'normal',
                      overflow: 'visible',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto',
                      textJustify: 'inter-word',
                      letterSpacing: '0.01em',
                      mb: 2,
                    }}
                  >
                    {warrantyExclusions[0]}
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.6,
                      color: 'black',
                      fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' },
                      fontWeight: 'bold',
                      textAlign: 'center',
                      maxWidth: '100%',
                      px: { xs: 1, sm: 2 },
                      whiteSpace: 'normal',
                      overflow: 'visible',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      letterSpacing: '0.02em',
                      borderTop: '1px solid rgba(0,0,0,0.1)',
                      pt: 2,
                    }}
                  >
                    Attach invoice to this warranty and hold for future reference
                  </Typography>
               </MotionPaper>
                           </MotionBox>

              {/* Installation Section */}
              <MotionBox variants={itemVariants} sx={{ mt: { xs: 3, sm: 4, md: 5 } }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    textAlign: 'center', 
                    fontWeight: 'bold', 
                    mb: { xs: 2, sm: 2.5, md: 3 },
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                    color: 'black',
                  }}
                >
                  Installation
                </Typography>
                <MotionPaper
                  variants={itemVariants}
                  sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    backgroundColor: 'background.paper',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    borderRadius: 2,
                    border: '1px solid rgba(0,0,0,0.05)',
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.8,
                      color: 'text.secondary',
                      fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' },
                      fontWeight: 400,
                      textAlign: 'justify',
                      maxWidth: '100%',
                      px: { xs: 1, sm: 2 },
                      whiteSpace: 'normal',
                      overflow: 'visible',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto',
                      textJustify: 'inter-word',
                      letterSpacing: '0.01em',
                      mb: 3,
                    }}
                  >
                    Installation is the sole responsibility of the customer. For technical questions concerning the installation, wiring, air compressor hook-ups or other issues, please contact a qualified mechanic or converter. A list of converters we work with is available upon request or at our website: www.superior-seats.com under the Distributors tab.
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.8,
                      color: 'text.secondary',
                      fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' },
                      fontWeight: 400,
                      textAlign: 'justify',
                      maxWidth: '100%',
                      px: { xs: 1, sm: 2 },
                      whiteSpace: 'normal',
                      overflow: 'visible',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto',
                      textJustify: 'inter-word',
                      letterSpacing: '0.01em',
                    }}
                  >
                    We do our best to match each customer with appropriate materials for the installation of the base purchased. However, because of the wide range of makes and models and the changes that are often made by the manufacturer from year to year, we cannot guarantee that mount up will be trouble-free. If you have any doubts or questions, please consult a qualified converter or mechanic.
                  </Typography>
                </MotionPaper>
              </MotionBox>

              {/* Returns Section */}
              <MotionBox variants={itemVariants} sx={{ mt: { xs: 3, sm: 4, md: 5 } }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    textAlign: 'center', 
                    fontWeight: 'bold', 
                    mb: { xs: 2, sm: 2.5, md: 3 },
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                    color: 'black',
                  }}
                >
                  Returns
                </Typography>
                <MotionPaper
                  variants={itemVariants}
                  sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    backgroundColor: 'background.paper',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    borderRadius: 2,
                    border: '1px solid rgba(0,0,0,0.05)',
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.8,
                      color: 'text.secondary',
                      fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' },
                      fontWeight: 400,
                      textAlign: 'justify',
                      maxWidth: '100%',
                      px: { xs: 1, sm: 2 },
                      whiteSpace: 'normal',
                      overflow: 'visible',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto',
                      textJustify: 'inter-word',
                      letterSpacing: '0.01em',
                    }}
                  >
                    We at Superior Seating work hard to get your custom seats made to your exact specifications. For this reason, we do not accept returns for any reason other than those stated in the Warranty policy.
                  </Typography>
                </MotionPaper>
              </MotionBox>
           </MotionBox>
         </Container>
       </Box>
       
       <Footer />
     </Box>
   );
 };

 export default Warranty; 