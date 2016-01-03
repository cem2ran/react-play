import React from 'react'
import ToolTip from 'react-portal-tooltip'
import style from './style.js'

const ToolTipButton = ({id, buttonText, isShown, hide, onClick, children}) => <div>
<ToolTip active={isShown} position="bottom" arrow="center" parent={`#${id}`}>
  <div>
    {children}
  </div>
</ToolTip>
<button id={id}
  style={style}
  onMouseLeave={hide} onClick={onClick}>
  {buttonText}
</button>
</div>

export default ToolTipButton
