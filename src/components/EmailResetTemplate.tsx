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
  Email as EmailIcon,
  Security as SecurityIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import Image from 'next/image';

interface EmailResetTemplateProps {
  onBack: () => void;
}

const MotionTypography = motion.create(Typography);
const MotionBox = motion.create(Box);
const MotionPaper = motion.create(Paper);

const EmailResetTemplate: React.FC<EmailResetTemplateProps> = ({ onBack }) => {
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
              Password Reset Request
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
              We received a request to reset your password for your Superior Seats account. If you made this request, click the button below to reset your password.
            </MotionTypography>

            {/* Reset Button */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              sx={{ textAlign: 'center', my: 4 }}
            >
              <Button
                variant="contained"
                size="large"
                className="gradient-style"
                href="https://superiorseats.com/reset-password?token=abc123xyz&email=john@example.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontWeight: 600,
                  borderRadius: 3,
                  textTransform: 'none',
                }}
              >
                Reset My Password
              </Button>
            </MotionBox>

            {/* Security Notice */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
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
                    Security Notice
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666',
                      lineHeight: 1.5,
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    }}
                  >
                    This link will expire in 24 hours for your security. If you didn&apos;t request this password reset, please ignore this email or contact our support team.
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

export default EmailResetTemplate;
