import React from 'react'
import { css } from 'emotion'

const Option = (props) => {
  const { children, className, cx, getStyles, isDisabled, isFocused, isSelected, innerRef, innerProps } = props
  const { onClick, ...restProps } = innerProps
  return (
    <div
      ref={innerRef}
      className={cx(
        css(getStyles('option', props)),
        {
          'option': true,
          'option--is-disabled': isDisabled,
          'option--is-focused': isFocused,
          'option--is-selected': isSelected,
        },
        className
      )}
      {...restProps}
    >
      {children}
      <span onClick={onClick} style={{ cursor: 'pointer' }}>{`x`}</span>
    </div>
  )
}

export default Option