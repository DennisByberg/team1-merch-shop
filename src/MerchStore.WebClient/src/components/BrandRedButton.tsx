import { Button, ButtonProps, useTheme } from '@mui/material';
import { LinkProps } from 'react-router-dom';

type BrandRedButtonProps = ButtonProps & Partial<LinkProps>;

export default function BrandRedButton(props: BrandRedButtonProps) {
  const theme = useTheme();
  return (
    <Button
      {...props}
      sx={{
        px: 4,
        backgroundColor: theme.palette.brandRed.main,
        color: theme.palette.brandRed.contrastText,
        '&:hover': {
          backgroundColor: theme.palette.brandRed.dark || theme.palette.brandRed.main,
        },
        ...props.sx,
      }}
    />
  );
}
