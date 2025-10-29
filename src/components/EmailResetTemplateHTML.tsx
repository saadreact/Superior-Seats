'use client';

import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

interface EmailResetTemplateHTMLProps {
  onBack: () => void;
}

const MotionTypography = motion.create(Typography);
const MotionBox = motion.create(Box);
const MotionPaper = motion.create(Paper);

const EmailResetTemplateHTML: React.FC<EmailResetTemplateHTMLProps> = ({ onBack }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Superior Seats</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        /* Reset styles */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }
        
        /* Main styles */
        body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #f5f5f5;
            font-family: Arial, sans-serif;
        }
        
        .email-wrapper {
            width: 100%;
            background-color: #f5f5f5;
            padding: 20px 0;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        
        .header {
            background-color: #d32f2f;
            padding: 30px 20px;
            text-align: center;
        }
        
        .logo-cell {
            width: 80px;
            height: 80px;
            background-color: #ffffff;
            border-radius: 50%;
            padding: 12px;
            vertical-align: middle;
        }
        
        .logo-img {
            width: 100%;
            height: auto;
            max-width: 56px;
            max-height: 56px;
        }
        
        .company-name {
            font-size: 32px;
            font-weight: bold;
            color: #ffffff;
            text-align: center;
            padding: 0 20px;
        }
        
        .header-title {
            font-size: 18px;
            font-weight: 600;
            color: #ffffff;
            opacity: 0.9;
            margin-top: 20px;
        }
        
        .body {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #333333;
            margin-bottom: 15px;
        }
        
        .message {
            color: #666666;
            margin-bottom: 30px;
            font-size: 16px;
            line-height: 1.6;
        }
        
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        
        .reset-button {
            display: inline-block;
            background-color: #d32f2f;
            color: #ffffff;
            text-decoration: none;
            padding: 15px 40px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
        }
        
        .security-notice {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e9ecef;
            margin: 30px 0;
        }
        
        .security-title {
            font-weight: 600;
            color: #d32f2f;
            margin-bottom: 10px;
            font-size: 16px;
        }
        
        .security-text {
            color: #666666;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .divider {
            height: 1px;
            background-color: #e9ecef;
            margin: 30px 0;
        }
        
        .footer {
            text-align: center;
            color: #999999;
        }
        
        .footer-email {
            margin-bottom: 15px;
            font-size: 14px;
        }
        
        .footer-copyright {
            font-size: 12px;
            line-height: 1.4;
        }
        
        /* Mobile styles */
        @media only screen and (max-width: 600px) {
            .email-wrapper {
                padding: 10px;
            }
            
            .body {
                padding: 30px 20px;
            }
            
            .company-name {
                font-size: 24px;
            }
            
            .reset-button {
                padding: 12px 30px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td align="center">
                    <table class="email-container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600">
                        <!-- Header -->
                        <tr>
                            <td class="header">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td width="80" align="left" valign="middle">
                                            <table class="logo-cell" role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                <tr>
                                                    <td align="center">
                                                        <img src="https://superiorseats.com/superiorlogo/logored.png" alt="Superior Seats Logo" class="logo-img">
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td class="company-name">Superior Seats</td>
                                        <td width="80"></td>
                                    </tr>
                                </table>
                                <div class="header-title">Password Reset Request</div>
                            </td>
                        </tr>
                        
                        <!-- Body -->
                        <tr>
                            <td class="body">
                                <div class="greeting">Hello John Doe,</div>
                                
                                <div class="message">
                                    We received a request to reset your password for your Superior Seats account. If you made this request, click the button below to reset your password.
                                </div>
                                
                                <div class="button-container">
                                    <a href="https://superiorseats.com/reset-password?token=abc123xyz&email=john@example.com" class="reset-button">
                                        Reset My Password
                                    </a>
                                </div>
                                
                                <div class="security-notice">
                                    <div class="security-title">
                                        🔒 Security Notice
                                    </div>
                                    <div class="security-text">
                                        This link will expire in 24 hours for your security. If you didn't request this password reset, please ignore this email or contact our support team.
                                    </div>
                                </div>
                                
                                <div class="divider"></div>
                                
                                <div class="footer">
                                    <div class="footer-email">
                                        This email was sent to john.doe@example.com
                                    </div>
                                    <div class="footer-copyright">
                                        © 2024 Superior Seats. All rights reserved.<br>
                                        123 Industrial Drive, Manufacturing City, MC 12345
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
  `;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="lg">
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

        {/* HTML Email Preview */}
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
          <Box sx={{ p: 3, backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
            <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
              HTML Email Template - Password Reset
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
              Complete HTML/CSS email template ready for email service integration
            </Typography>
          </Box>
          
          <Box
            sx={{
              height: '600px',
              overflow: 'auto',
              '& iframe': {
                width: '100%',
                height: '100%',
                border: 'none',
              },
            }}
          >
            <iframe
              srcDoc={htmlContent}
              title="Password Reset Email Template"
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </Box>
        </MotionPaper>
      </Container>
    </Box>
  );
};

export default EmailResetTemplateHTML;
