import React from 'react';
import PropTypes from 'prop-types';

import './button.css';

const Button = ({
  className,
  children,
  disabled,
  onClick,
  dataTestId,
}) => (
  <button
    data-testid={dataTestId}
    onClick={onClick}
    className={`button-text ${className}`}
    disabled={disabled}
    type="button"
  >
    {children}
  </button>
);

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  dataTestId: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

Button.defaultProps = {
  children: null,
  className: '',
  disabled: false,
  dataTestId: '',
};

export default Button;
