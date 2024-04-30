import React, { useContext } from 'react'

import classes from "./NavButton.module.css"
import classNames from 'classnames'
import { Icon } from '@iconify/react'
import { IconType } from '../../../../utils/icons'
import { NavLink } from 'react-router-dom'
import { MapContext } from '../../../../pages/Map/Map'

type PropsType = {
    icon: IconType
    to: string
}

function NavButton({
    icon,
    to
}: PropsType) {

    const { isInfoActive, enableInfo } = useContext(MapContext)

    return (
        <NavLink
            to={to}
            onClick={enableInfo}
            className={({ isActive }) => classNames(classes.btn, { [classes.btnActive]: isActive && isInfoActive })}>
            <Icon icon={icon} />
        </NavLink>
    )
}

export default NavButton