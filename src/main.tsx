import { ThemeProvider } from '@emotion/react';
import '@fontsource-variable/source-sans-3';
import CssBaseline from '@mui/material/CssBaseline';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import './index.css';
import { theme } from './theme/theme.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
  // </React.StrictMode>,
);
