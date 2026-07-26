import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Reusable button component with style variants.
 * Utilises CSS classes defined in index.css:
 *   .btn, .btn-primary, .btn-outline, .btn-sm, .btn-md, .btn-lg
 */
export default function Button({
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  className,
  ...rest
}) {
  const btnClass = classNames(
    'btn',
    {
      [`btn-${variant}`]: variant,
      [`btn-${size}`]: size,
    },
    className
  );

  return (
    <button
      type={type}
      className={btnClass}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'outline', 'secondary', 'danger', 'success', 'info']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
