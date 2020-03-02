import React from 'react';
import PropTypes from 'prop-types';

import './button.css';

const Button = ({
  dataTestId,
  className,
  children,
  disabled,
  onClick,
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
  dataTestId: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

Button.defaultProps = {
  dataTestId: '',
  children: null,
  className: '',
  disabled: false,
};

export default Button;
