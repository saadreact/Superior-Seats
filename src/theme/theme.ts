import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f', // Superior Seats Red (updated from DA291C)
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
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '1rem',
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
          boxShadow: '0 2px 8px rgba(211, 47, 47, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.4)',
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