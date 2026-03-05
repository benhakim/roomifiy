import React from 'react'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | string
  size?: 'sm' | 'md' | 'lg' | string
  fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...props
}) => {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full-width' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button {...props} className={classes}>
      {children}
    </button>
  )
}

export default Button