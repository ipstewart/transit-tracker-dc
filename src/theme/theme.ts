import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const typography = {
  fontFamily: "'Source Sans 3 Variable'",
  h5: {
    fontWeight: 500,
  },
};

const lightTheme = responsiveFontSizes(
  createTheme({
    palette: {
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
      background: {
        default: '#FAF9F6',
        paper: '#FFF',
      },
    },
    typography,
  }),
);

const darkTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#81CCE8',
      },
      secondary: {
        main: '#f48fb1',
      },
      info: {
        main: '#B2DE69',
      },
      background: {
        default: '#303030',
        paper: '#424242',
      },
    },
    typography,
  }),
);

export { lightTheme, darkTheme };
