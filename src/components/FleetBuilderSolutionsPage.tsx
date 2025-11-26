"use client";

import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSectionCommon from "@/components/common/HeroSectionaCommon";
import LazyImage from "@/components/common/LazyImage";

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

const FleetBuilderSolutionsPage = () => {
  // Base URL for images from server
  const IMAGE_BASE_URL =
    process.env.NEXT_PUBLIC_STATIC_IMAGES ||
    "https://api.superiorseatingllc.com/images";

  // Fleet Buses data (separate section)
  const fleetBusesData = {
    title: "Fleet Buses",
    subtitle: "Large-Scale Solutions",
    description:
      "Large-scale seating solutions for public transit, school buses, and commercial fleet operations. We deliver high-volume orders with consistent quality and on-time delivery.",
    additionalImages: [
      {
        src: `${IMAGE_BASE_URL}/Gallery/Truckimages/cu2.png`,
        alt: "Fleet buses",
      },
      {
        src: `${IMAGE_BASE_URL}/Gallery/Truckimages/c10.png`,
        alt: "Fleet buses 2",
      },
    ],
  };

  // Partner solutions data (cards starting from Luxury Limousines)
  const partnerSolutions = [
    {
      title: "Luxury Limousines",
      subtitle: "Executive Transportation",
      description:
        "Luxury seating for executive transportation and special occasions. Premium materials and elegant designs that match the sophistication of high-end limousines.",
      image: `${IMAGE_BASE_URL}/Gallery/Truckimages/limo.png`,
      imageType: "wide", // Wide images for Limos
      additionalImages: [
        {
          src: `${IMAGE_BASE_URL}/Gallery/Truckimages/limo.png`,
          alt: "Luxury limos 2",
        },
        {
          src: `${IMAGE_BASE_URL}/Gallery/Truckimages/limo2.png`,
          alt: "Luxury limos 3",
        },
      ],
    },
    {
      title: "RV Upfitters",
      subtitle: "Custom Solutions",
      description:
        "Custom solutions for recreational vehicles and commercial vans. We understand the unique challenges of RV and van customization, delivering seats that maximize space while providing ultimate comfort.",
      image: `${IMAGE_BASE_URL}/Gallery/Truckimages/c4.png`,
      imageType: "wide", // Wide images for RV
      additionalImages: [
        {
          src: `${IMAGE_BASE_URL}/Gallery/Truckimages/c12.png`,
          alt: "RV and vans 2",
        },
        {
          src: `${IMAGE_BASE_URL}/Gallery/Truckimages/13.png`,
          alt: "RV and vans 3",
        },
      ],
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fafafa" }}>
      <Header />

      {/* Hero Section */}
      <HeroSectionCommon
        title="Fleet & Builder Solutions"
        description="We partner with RV, limousine, and bus manufacturers."
        height={{
          xs: "75px",
          sm: "70px",
          md: "80px",
          lg: "95px",
          xl: "105px",
          xxl: "115px",
        }}
      />

      {/* Introduction Section */}
      <Box
        sx={{
          py: { xs: 4, sm: 6, md: 3, lg: 3 },
          backgroundColor: "white",
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: { xs: 4, md: 6, lg: 8 },
              alignItems: "start",
            }}
          >
            {/* Content - Left Side */}
            <MotionBox
              initial={{ opacity: 0, x: -50, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              sx={{ order: { xs: 2, md: 1 } }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  fontSize: {
                    xs: "1.25rem",
                    sm: "1.7rem",
                    md: "1.9rem",
                    lg: "2.2rem",
                    xl: "2.2rem",
                  },
                  letterSpacing: 2,
                  display: "block",
                  mb: { xs: 0.5, sm: 1 },
                }}
              >
                PARTNERSHIP EXCELLENCE
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  mt: { xs: 1.5, sm: 2 },
                  mb: { xs: 2, sm: 3 },
                  fontWeight: 600,
                  color: "text.primary",
                  fontSize: {
                    xs: "1.5rem",
                    sm: "1.75rem",
                    md: "2rem",
                    lg: "2.5rem",
                    xl: "2.5rem",
                  },
                  lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 },
                }}
              >
                Premium Custom Seating Solutions
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.8,
                  mb: { xs: 2, sm: 3 },
                  fontSize: {
                    xs: "0.875rem",
                    sm: "0.95rem",
                    md: "1rem",
                    lg: "1.125rem",
                  },
                }}
              >
                Our process spans the entire journey: early design sketches, rapid prototyping, material selection, and full-scale production
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  mb: { xs: 2, sm: 15 },
                  lineHeight: 1.8,
                  fontSize: {
                    xs: "0.875rem",
                    sm: "0.95rem",
                    md: "1rem",
                    lg: "1.125rem",
                  },
                }}
              >
               Every seat that rolls out of our facility carries a quiet promise comfort that lasts, durability that earns trust, and craftsmanship your customers immediately feel when they sit down.
               Whether it’s luxury travel, commercial transport, or custom fleet builds, we help you deliver interiors that look refined, feel exceptional, and stand the test of miles.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.8,
                  mb: { xs: 2, sm: 3 },
                  fontSize: {
                    xs: "0.875rem",
                    sm: "0.95rem",
                    md: "1rem",
                    lg: "1.125rem",
                  },
                }}
              >
                  We partner with RV, limousine, and bus manufacturers and
                upfitters to provide premium custom seating solutions.
              
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.8,
                  
                  fontSize: {
                    xs: "0.875rem",
                    sm: "0.95rem",
                    md: "1rem",
                    lg: "1.125rem",
                  },
                }}
              >
                From design and prototyping to full-scale production, our team
                delivers comfort, durability, and craftsmanship your customers
                will notice.
              </Typography>
            </MotionBox>

            {/* Two Images - Right Side Stacked */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 2, sm: 3, md: 4 },
                order: { xs: 1, md: 2 },
              }}
            >
              {[
                { src: `${IMAGE_BASE_URL}/Gallery/Truckimages/c11.png`, alt: "Custom seating solutions" },
                { src: `${IMAGE_BASE_URL}/Gallery/Truckimages/cu4.png`, alt: "Custom seating solutions" },
              ].map((image, imgIndex) => (
                <MotionBox
                  key={imgIndex}
                  initial={{ opacity: 0, x: 50, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: imgIndex * 0.1 }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                      backgroundColor: "#ffffff",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      height: { xs: 350, sm: 400, md: 270, lg: 400 },
                      width: { xs: 350, sm: 400, md: 400, lg: 600 },
                      "&:hover": {
                        transform: "translateY(-4px) scale(1.02)",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <LazyImage
                      src={image.src}
                      alt={image.alt}
                      fill
                      showSkeleton={true}
                      quality={85}
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        display: "block",
                      }}
                      priority={imgIndex === 0}
                    />
                  </Box>
                </MotionBox>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Services Section */}
      <Box
        sx={{ py: { xs: 4, sm: 6, md: 8, lg: 10 }, backgroundColor: "#f8f9fa" }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <MotionBox
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            sx={{ textAlign: "center", mb: { xs: 3, sm: 4, md: 6 } }}
          >
            <Typography
              variant="overline"
              sx={{
                color: "primary.main",
                fontWeight: 600,
                letterSpacing: 2,
                fontSize: {
                  xs: "1.25rem",
                  sm: "1.7rem",
                  md: "1.9rem",
                  lg: "2.2rem",
                  xl: "2.2rem",
                },
              }}
            >
              OUR SERVICES
            </Typography>
            <Typography
              variant="h2"
              sx={{
                mt: { xs: 1.5, sm: 2 },
                fontWeight: 700,
                fontSize: {
                  xs: "1.75rem",
                  sm: "2rem",
                  md: "2.5rem",
                  lg: "3rem",
                  xl: "3rem",
                },
              }}
            >
              Partner Solutions
            </Typography>
            <Typography
              sx={{
                mt: { xs: 1.5, sm: 2 },
                color: "text.secondary",
                maxWidth: 800,
                mx: "auto",
                fontSize: { xs: "0.875rem", sm: "0.95rem", md: "1rem" },
              }}
            >
              Explore our comprehensive seating solutions designed for different
              vehicle types and industries.
            </Typography>
          </MotionBox>


          {/* Fleet Buses Section - Separate handling */}
          <Box sx={{ mb: { xs: 6, md: 10 } }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: { xs: 4, md: 6, lg: 8 },
                alignItems: "center",
              }}
            >
              {/* Left Side - Heading and Description */}
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8 }}
                sx={{ order: { xs: 1, md: 1 } }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    color: "primary.main",
                    fontWeight: 600,
                    fontSize: {
                      xs: "1.25rem",
                      sm: "1.7rem",
                      md: "1.9rem",
                      lg: "2.2rem",
                      xl: "2.2rem",
                    },
                    display: "block",
                    mb: { xs: 0.5, sm: 1 },
                  }}
                >
                  {fleetBusesData.title.toUpperCase()}
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    mt: { xs: 0.75, sm: 1 },
                    mb: { xs: 1.5, sm: 2 },
                    fontWeight: "medium",
                    fontSize: {
                      xs: "1.5rem",
                      sm: "1.8rem",
                      md: "2.2rem",
                      lg: "2.5rem",
                      xl: "2.5rem",
                    },
                  }}
                >
                  {fleetBusesData.subtitle}
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.9,
                    fontSize: {
                      xs: "0.9rem",
                      sm: "1rem",
                      md: "1.1rem",
                      lg: "1.2rem",
                      xl: "1.2rem",
                    },
                  }}
                >
                  {fleetBusesData.description}
                </Typography>
              </MotionBox>

              {/* Right Side - 2 Images Parallel */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: { xs: 2, sm: 3, md: 4 },
                  justifyContent: "center",
                  alignItems: "center",
                  order: { xs: 2, md: 2 },
                }}
              >
                {fleetBusesData.additionalImages.map((image, imgIndex) => (
                  <MotionBox
                    key={imgIndex}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: imgIndex * 0.1 }}
                    sx={{
                      width: "auto",
                      flex: { xs: "1 1 100%", md: "1 1 calc(50% - 8px)" },
                      maxWidth: { xs: "100%", md: "calc(50% - 8px)" },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                        backgroundColor: "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        height: { xs: 350, sm: 400, md: 450, lg: 500 },
                        width: "auto",
                        "&:hover": {
                          transform: "translateY(-4px) scale(1.02)",
                          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                        },
                      }}
                    >
                      <LazyImage
                        src={image.src}
                        alt={image.alt}
                        width={400}
                        height={600}
                        showSkeleton={true}
                        quality={85}
                        style={{
                          objectFit: "contain",
                          width: "auto",
                          height: "100%",
                          maxHeight: "100%",
                          display: "block",
                        }}
                        priority={imgIndex === 0}
                      />
                    </Box>
                  </MotionBox>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Partner Solutions Cards with alternating layout - Starting from Luxury Limousines */}
          {partnerSolutions.map((solution, index) => {
            const imgStyles = {
              width: "100%",
              height: "100%",
              objectFit: "cover" as const,
              display: "block",
              transition: "transform 0.3s ease",
            };
            
            return (
              <Box key={index} sx={{ mb: { xs: 6, md: 10 } }}>
                {/* Main Card */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: { xs: 3, md: 6 },
                    alignItems: "center",
                    mb: { xs: 4, sm: 5, md: 6 },
                  }}
                >
                  {/* Content */}
                  <MotionBox
                    initial={{
                      opacity: 0,
                      x: index % 2 === 0 ? -50 : 50,
                      y: 20,
                    }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                      delay: index * 0.1,
                    }}
                    sx={{ order: { xs: 2, md: index % 2 === 0 ? 1 : 2 } }}
                  >
                    <MotionTypography
                      variant="overline"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                        delay: 0.1 + index * 0.1,
                      }}
                      sx={{
                        color: "primary.main",
                        fontWeight: 600,
                        fontSize: {
                          xs: "1.25rem",
                          sm: "1.7rem",
                          md: "1.9rem",
                          lg: "2.2rem",
                          xl: "2.2rem",
                        },
                        display: "block",
                        mb: { xs: 0.5, sm: 1 },
                      }}
                    >
                      {solution.title.toUpperCase()}
                    </MotionTypography>
                    <MotionTypography
                      variant="h3"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                        delay: 0.2 + index * 0.1,
                      }}
                      sx={{
                        mt: { xs: 0.75, sm: 1 },
                        mb: { xs: 1.5, sm: 2 },
                        fontWeight: "medium",
                        fontSize: {
                          xs: "1.5rem",
                          sm: "1.8rem",
                          md: "2.2rem",
                          lg: "2.5rem",
                          xl: "2.5rem",
                        },
                      }}
                    >
                      {solution.subtitle}
                    </MotionTypography>
                    <MotionTypography
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                        delay: 0.4 + index * 0.1,
                      }}
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.9,
                        fontSize: {
                          xs: "0.9rem",
                          sm: "1rem",
                          md: "1.1rem",
                          lg: "1.2rem",
                          xl: "1.2rem",
                        },
                      }}
                    >
                      {solution.description}
                    </MotionTypography>
                  </MotionBox>

                  {/* Image - Same width and height as container */}
                  <MotionBox
                    initial={{
                      opacity: 0,
                      x: index % 2 === 0 ? 50 : -50,
                      y: 20,
                      scale: 0.9,
                    }}
                    whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                      delay: index * 0.1 + 0.2,
                    }}
                    sx={{
                      position: "relative",
                      display: "inline-block",
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                      order: { xs: 1, md: index % 2 === 0 ? 2 : 1 },
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      backgroundColor: "#ffffff",
                      height: { xs: 350, sm: 400, md: 270, lg: 400 },
                      width: { xs: 350, sm: 400, md: 400, lg: 600 },
                      "&:hover": {
                        transform: "translateY(-4px) scale(1.02)",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <LazyImage
                      src={solution.image}
                      alt={solution.subtitle}
                      fill
                      showSkeleton={true}
                      quality={85}
                      style={{
                        objectFit: "contain",
                        position: "absolute",
                      }}
                      priority={index === 0}
                    />
                  </MotionBox>
                </Box>

                {/* Additional Images - Special handling for Fleet Buses */}
                {solution.additionalImages &&
                  solution.additionalImages.length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 2, sm: 3, md: 4 },
                        justifyContent: "center",
                        alignItems: "center",
                        flexWrap: "wrap",
                        maxWidth: "100%",
                        width: "100%",
                      }}
                    >
                      {solution.additionalImages.map((image, imgIndex) => {
                        return (
                          <MotionBox
                            key={imgIndex}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 0.7, delay: imgIndex * 0.1 }}
                            sx={{
                              width: { xs: 350, sm: 400, md: 400, lg: 600 },
                              maxWidth: { xs: "100%", sm: "calc(50% - 12px)", md: "calc(50% - 16px)" },
                            }}
                          >
                            <Box
                              sx={{
                                position: "relative",
                                display: "inline-block",
                                borderRadius: 2,
                                overflow: "hidden",
                                boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                                backgroundColor: "#ffffff",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                height: { xs: 350, sm: 400, md: 270, lg: 400 },
                                width: { xs: 350, sm: 400, md: 400, lg: 600 },
                                "&:hover": {
                                  transform: "translateY(-4px) scale(1.02)",
                                  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                                },
                              }}
                            >
                              <LazyImage
                                src={image.src}
                                alt={image.alt}
                                fill
                                showSkeleton={true}
                                quality={85}
                                style={{
                                  objectFit: "contain",
                                  position: "absolute",
                                }}
                                priority={false}
                              />
                            </Box>
                          </MotionBox>
                        );
                      })}
                    </Box>
                  )}
              </Box>
            );
          })}
        </Container>
      </Box>

      {/* Footer Component */}
      <Footer />
    </Box>
  );
};

export default FleetBuilderSolutionsPage;
