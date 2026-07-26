import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Reusable input component used across the app for forms.
 * It supports an optional leading icon and integrates with the existing
 * CSS classes (`form-control`, `input-icon`).
 */
export default function Input({ type = 'text', placeholder = '', value, onChange, icon, className, disabled = false, ...rest }) {
  const wrapperClass = classNames('form-wrapper', { disabled, [className]: className });
  const inputClass = classNames('form-control', { 'no-icon': !icon });

  return (
    <div className={wrapperClass}>
      {icon && <span className="input-icon" aria-hidden="true">{icon}</span>}
      <input
        type={type}
        className={inputClass}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...rest}
      />
    </div>
  );
}

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  icon: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};
