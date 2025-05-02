import { Box, CircularProgress, Typography, SxProps, Theme } from '@mui/material';

type SpinnerProps = {
  text?: string;
  sx?: SxProps<Theme>;
};

export default function CustomSpinner({ text = 'Loading...', sx }: SpinnerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
        width: '100%',
        py: 8,
        ...sx,
      }}
    >
      <CircularProgress color="inherit" />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {text}
      </Typography>
    </Box>
  );
}
