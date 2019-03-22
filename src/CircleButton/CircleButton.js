import React from 'react'
import './CircleButton.css'

export default function NavCircleButton(props) {
  const { tag, className, children, ...otherProps } = props // ...otherProps here is a rest (i.e. rest of...) operator 

  return React.createElement(
    props.tag,
    {
      className: ['NavCircleButton', props.className].join(' '),
      ...otherProps
    },
    props.children
  )

}

NavCircleButton.defaultProps ={
  tag: 'a',
}
