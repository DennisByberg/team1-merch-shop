import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    brandRed: Palette['primary'];
  }
  interface PaletteOptions {
    brandRed?: PaletteOptions['primary'];
  }
}
