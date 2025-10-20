import { createTheme } from '@mui/material/styles';

// Extend MUI breakpoints to include ultra-high resolutions
declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    '4xl': true;
    '5xl': true;
    '6xl': true;
    '8xl': true;
  }
}

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      // Custom ultra-high resolutions
      '4xl': 3840, // 4K UHD width
      '5xl': 5120, // 5K width
      '6xl': 6016, // 6K width
      '8xl': 7680, // 8K UHD width
    },
  },
  palette: {
    primary: {
     main: '#d32f2f', // Superior Seats Red (updated from DA291C)
    //  main: '#da291c',  //Client color 
      light: '#ff6659',
      dark: '#9a0007',
    },
    secondary: {
      main: '#000000', // Black
      light: '#424242',
      dark: '#000000',
    },
    background: {
      default: '#ffffff', // White
    },
    text: {
      primary: '#000000', // Black text
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Raleway", "Roboto", sans-serif',
    

    
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      '@media (min-width:600px)': {
        fontSize: '3.75rem',
      },
      '@media (min-width:960px)': {
        fontSize: '4.5rem',
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      '@media (min-width:600px)': {
        fontSize: '3rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      '@media (min-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      '@media (min-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.43,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 400,
      textTransform: 'uppercase',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4, // Changed from 8 to match custom styling
          fontWeight: 500,
          fontSize: '1rem',
          letterSpacing: 0.5, // Added from custom styling
          transition: 'all 0.3s ease', // Added from custom styling
          '@media (min-width:600px)': {
            fontSize: '0.9rem',
          },
          '@media (min-width:900px)': {
            fontSize: '1.1rem',
          },
          '@media (min-width:1200px)': {
            fontSize: '1rem',
          },
          '@media (min-width:1536px)': {
            fontSize: '1rem',
          },
        },
        contained: {
          // Custom styling from ContactPage button
          boxShadow: 'none', // Changed from red shadow to none
          '&:hover': {
            boxShadow: 'none', // No shadow on hover
          },
          '&:disabled': {
            opacity: 0.7, // Added disabled state styling
          },
          // Touch ripple styling
          '& .MuiTouchRipple-root': {
            borderRadius: 2,
          },
          // Add custom class for gradient styling
          '&.gradient-style': {
            background: 'linear-gradient(135deg, #d32f2f 0%, #9a0007 100%)',
            color: 'white',
            boxShadow: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #d32f2f 0%, #9a0007 100%)',
              boxShadow: 'none',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          color: '#d32f2f',
        },
      },
    },
  },
}); 