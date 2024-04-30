import React from 'react'
import classes from './Emph.module.css'

const Emph: React.FC<React.PropsWithChildren> = ({
    children
}) => {
  return (
    <span className={classes.container}>{children}</span>
  )
}

export default Emph