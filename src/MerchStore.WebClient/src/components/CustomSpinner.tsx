import { Box, CircularProgress, Typography, SxProps, Theme } from '@mui/material';

type Props = {
  text: string;
};

export default function CustomSpinner(props: Props) {
  return (
    <Box sx={SPINNER_CONTAINER_SX}>
      <CircularProgress color={'inherit'} />
      <Typography variant={'body2'} color={'text.secondary'} sx={SPINNER_TEXT_SX}>
        {props.text}
      </Typography>
    </Box>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const SPINNER_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 300,
  width: '100%',
  py: 8,
};

const SPINNER_TEXT_SX: SxProps<Theme> = {
  mt: 2,
};
