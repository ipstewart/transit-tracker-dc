import { ThemeProvider } from '@emotion/react';
import '@fontsource-variable/source-sans-3';
import CssBaseline from '@mui/material/CssBaseline';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import App from './App.tsx';
import './index.css';
import { theme } from './theme/theme.ts';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/:location',
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <RouterProvider router={router} />
  </ThemeProvider>,
  // </React.StrictMode>,
);
