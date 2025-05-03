import React, { createContext, useContext, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import { useTheme } from './ThemeContext';

// Define the context type
type MaterialUIThemeContextType = {
  toggleColorMode: () => void;
};

// Create the context
const MaterialUIThemeContext = createContext<MaterialUIThemeContextType | undefined>(undefined);

// Custom hook to use the Material UI theme context
export const useMaterialUITheme = () => {
  const context = useContext(MaterialUIThemeContext);
  if (context === undefined) {
    throw new Error('useMaterialUITheme must be used within a MaterialUIThemeProvider');
  }
  return context;
};

// AI-assisted theme generation
const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode palette
          primary: {
            main: '#0ea5e9', // Cyan-500
            light: '#38bdf8', // Cyan-400
            dark: '#0284c7', // Cyan-600
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#8b5cf6', // Violet-500
            light: '#a78bfa', // Violet-400
            dark: '#7c3aed', // Violet-600
            contrastText: '#ffffff',
          },
          background: {
            default: '#f8fafc', // Slate-50
            paper: '#ffffff',
          },
          text: {
            primary: '#0f172a', // Slate-900
            secondary: '#475569', // Slate-600
          },
          error: {
            main: '#ef4444', // Red-500
          },
          warning: {
            main: '#f59e0b', // Amber-500
          },
          info: {
            main: '#3b82f6', // Blue-500
          },
          success: {
            main: '#10b981', // Emerald-500
          },
        }
      : {
          // Dark mode palette
          primary: {
            main: '#0ea5e9', // Cyan-500
            light: '#38bdf8', // Cyan-400
            dark: '#0284c7', // Cyan-600
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#8b5cf6', // Violet-500
            light: '#a78bfa', // Violet-400
            dark: '#7c3aed', // Violet-600
            contrastText: '#ffffff',
          },
          background: {
            default: '#0f172a', // Slate-900
            paper: '#1e293b', // Slate-800
          },
          text: {
            primary: '#f8fafc', // Slate-50
            secondary: '#cbd5e1', // Slate-300
          },
          error: {
            main: '#ef4444', // Red-500
          },
          warning: {
            main: '#f59e0b', // Amber-500
          },
          info: {
            main: '#3b82f6', // Blue-500
          },
          success: {
            main: '#10b981', // Emerald-500
          },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

// Material UI Theme Provider component
export const MaterialUIThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the existing theme context
  const { theme } = useTheme();
  
  // Convert our theme to Material UI's theme mode
  const mode = theme === 'dark' ? 'dark' : 'light';
  
  // Create the theme with the design tokens
  const muiTheme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  
  // Context value
  const contextValue = useMemo(
    () => ({
      toggleColorMode: () => {
        // This is handled by the existing ThemeContext
      },
    }),
    []
  );
  
  return (
    <MaterialUIThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </MaterialUIThemeContext.Provider>
  );
};

export default MaterialUIThemeProvider;
