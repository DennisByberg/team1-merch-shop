import { Box, CircularProgress, Typography, SxProps, Theme } from '@mui/material';
import { useState, useEffect } from 'react';

type Props = {
  text?: string;
  texts?: string[];
  intervalSeconds?: number;
};

export default function CustomSpinner(props: Props) {
  const { text, texts, intervalSeconds = 2 } = props;
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Use texts array if provided, otherwise fall back to single text
  const textArray = texts || (text ? [text] : ['Loading...']);
  const currentText = textArray[currentTextIndex];

  useEffect(() => {
    // Only rotate texts if there are multiple texts
    if (textArray.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % textArray.length);
    }, intervalSeconds * 1000);

    return () => clearInterval(interval);
  }, [textArray.length, intervalSeconds]);

  return (
    <Box sx={SPINNER_CONTAINER_SX}>
      <CircularProgress color={'inherit'} />
      <Typography variant={'body2'} color={'text.secondary'} sx={SPINNER_TEXT_SX}>
        {currentText}
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
