import React from 'react';
import * as classes from './ButtonCommon.module.scss';

interface ButtonProps {
  className?: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

const ButtonCommon: React.FC<ButtonProps> = ({ className, isActive, disabled, onClick, children }) => {
  const btnClassName = `${classes.button} ${className || ''}`;

  return (
    <button onClick={onClick} disabled={disabled} className={btnClassName}>
      {isActive && <span className={classes['button__spinner']}></span>}
      {children}
    </button>
  );
}

export default ButtonCommon;