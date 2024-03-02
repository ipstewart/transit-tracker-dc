import { createTheme, responsiveFontSizes } from '@mui/material/styles';

export const theme = responsiveFontSizes(
  createTheme({
    palette: {
      background: {
        default: '#FAF9F6',
        paper: '#FFF',
      },
      primary: {
        light: '#454545',
        main: '#002F6C',
      },
      secondary: {
        main: '#C8102E',
      },
      info: {
        main: '#33A532',
      },
    },
    typography: {
      fontFamily: "'Source Sans 3 Variable'",
      h5: {
        fontWeight: 500,
      },
    },
  }),
);
