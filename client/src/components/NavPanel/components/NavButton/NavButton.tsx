import React, { useContext } from 'react'

import classes from "./NavButton.module.css"
import classNames from 'classnames'
import { Icon } from '@iconify/react'
import { IconType } from '../../../../utils/icons'
import { NavLink } from 'react-router-dom'

type PropsType = {
    icon: IconType
    to: string
}

function NavButton({
    icon,
    to
}: PropsType) {

    return (
        <NavLink
            to={to}
            className={({ isActive }) => classNames(classes.btn, { [classes.btnActive]: isActive })}>
            <Icon icon={icon} />
        </NavLink>
    )
}

export default NavButton