'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Security as SecurityIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import Image from 'next/image';

interface TwoFactorEmailTemplateProps {
  onBack: () => void;
}

const MotionTypography = motion.create(Typography);
const MotionBox = motion.create(Box);
const MotionPaper = motion.create(Paper);

const TwoFactorEmailTemplate: React.FC<TwoFactorEmailTemplateProps> = ({ onBack }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="md">
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowForwardIcon sx={{ transform: 'rotate(180deg)' }} />}
            onClick={onBack}
            sx={{ color: '#d32f2f', fontWeight: 600 }}
          >
            Back to Demo
          </Button>
        </Box>

        {/* Email Template */}
        <MotionPaper
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Email Header */}
          <Box
            sx={{
              backgroundColor: '#d32f2f',
              color: 'white',
              p: 3,
              textAlign: 'center',
            }}
          >
            <Box sx={{ position: 'relative', mb: 2 }}>
              <Box
                sx={{
                  position: 'absolute',
                  left: 20,
                  top: '90%',
                  transform: 'translateY(-50%)',
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                }}
              >
                <Image
                  src="/superiorlogo/logored.png"
                  alt="Superior Seats Logo"
                  width={70}
                  height={70}
                  style={{ objectFit: 'contain' }}
                />
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold', 
                  fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                  textAlign: 'center',
                  width: '100%'
                }}
              >
                Superior Seats
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.9 }}>
              Two-Factor Authentication Code
            </Typography>
          </Box>

          {/* Email Body */}
          <Box sx={{ p: { xs: 3, sm: 4, md: 5 }, backgroundColor: 'white' }}>
            {/* Greeting */}
            <MotionTypography
              variant="h6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              sx={{
                fontWeight: 600,
                color: '#333',
                mb: 2,
                fontSize: { xs: '1.1rem', sm: '1.2rem' },
              }}
            >
              Hello John Doe,
            </MotionTypography>

            <MotionTypography
              variant="body1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              sx={{
                color: '#666',
                lineHeight: 1.6,
                mb: 3,
                fontSize: { xs: '0.9rem', sm: '1rem' },
              }}
            >
              You're signing in to your Superior Seats account. Use the verification code below to complete your login:
            </MotionTypography>

            {/* Verification Code */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              sx={{
                textAlign: 'center',
                my: 4,
                p: 4,
                backgroundColor: '#f8f9fa',
                borderRadius: 3,
                border: '2px solid #e9ecef',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  mb: 2,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontWeight: 500,
                }}
              >
                Your verification code:
              </Typography>
              
              <Typography
                variant="h4"
                sx={{
                  color: '#d32f2f',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  letterSpacing: 2,
                  fontSize: { xs: '1.8rem', sm: '2.2rem' },
                }}
              >
                123456
              </Typography>
            </MotionBox>

            {/* Timer Notice */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              sx={{
                backgroundColor: '#fff3cd',
                p: 3,
                borderRadius: 2,
                border: '1px solid #ffeaa7',
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TimerIcon sx={{ color: '#f39c12', fontSize: 20 }} />
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: '#f39c12',
                      mb: 1,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    }}
                  >
                    Code Expires in 5 Minutes
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#856404',
                      lineHeight: 1.5,
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    }}
                  >
This verification code will expire in 5 minutes for security reasons. If you didn't request this code, please ignore this email.
                  </Typography>
                </Box>
              </Box>
            </MotionBox>

            {/* Security Notice */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              sx={{
                backgroundColor: '#f8f9fa',
                p: 3,
                borderRadius: 2,
                border: '1px solid #e9ecef',
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <SecurityIcon sx={{ color: '#d32f2f', fontSize: 20, mt: 0.5 }} />
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: '#d32f2f',
                      mb: 1,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    }}
                  >
                    Security Tips
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666',
                      lineHeight: 1.5,
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    }}
                  >
                    • Never share this code with anyone<br />
                    • Superior Seats will never ask for your verification code<br />
                    • If you didn't request this code, your account may be compromised
                  </Typography>
                </Box>
              </Box>
            </MotionBox>

            <Divider sx={{ my: 3 }} />

            {/* Footer */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              sx={{ textAlign: 'center' }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#999',
                  mb: 2,
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                }}
              >
                This email was sent to john.doe@example.com
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#999',
                  fontSize: { xs: '0.7rem', sm: '0.8rem' },
                }}
              >
                © 2024 Superior Seats. All rights reserved.<br />
                123 Industrial Drive, Manufacturing City, MC 12345
              </Typography>
            </MotionBox>
          </Box>
        </MotionPaper>
      </Container>
    </Box>
  );
};

export default TwoFactorEmailTemplate;
