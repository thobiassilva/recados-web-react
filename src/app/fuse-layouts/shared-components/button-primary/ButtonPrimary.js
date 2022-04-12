import { Button } from '@mui/material';

export default function ButtonPrimary({
  title,
  disabled,
  type,
  ariaLabel,
  fullWidth,
  onClick,
  color,
}) {
  return (
    <Button
      type={type}
      variant="contained"
      color={color ?? 'secondary'}
      className="mx-auto mt-16 text-20 font-extrabold"
      aria-label={ariaLabel}
      fullWidth={fullWidth}
      disabled={disabled}
      value="legacy"
      onClick={onClick}
    >
      {title}
    </Button>
  );
}
