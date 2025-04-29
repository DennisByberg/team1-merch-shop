import { Box, SxProps, Theme } from '@mui/material';
import { grey } from '@mui/material/colors';

export default function Footer() {
  return (
    <Box component={'footer'} sx={FOOTER_STYLE}>
      <Box component={'small'} sx={{ fontSize: '0.7rem' }}>
        &copy; 2025 No1. All rights reserved.
      </Box>
    </Box>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const FOOTER_STYLE: SxProps<Theme> = {
  textAlign: 'center',
  pb: 2,
  pt: 5,
  color: grey[700],
};
