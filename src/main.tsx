import '@fontsource-variable/source-sans-3';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import App from './App.tsx';
import './index.css';
import { ThemeProviderWrapper } from './theme/ThemeContext.tsx';

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
  <ThemeProviderWrapper>
    <RouterProvider router={router} />
  </ThemeProviderWrapper>,
  // </React.StrictMode>,
);
