import React from 'react'
import classes from "./PrioritySlider.module.css"
import { Slider } from '@mui/material'

type PropsType = {
    attributeName: string
    value: number
    onChange: (value: number) => void
}

function PrioritySlider({
    attributeName,
    value,
    onChange
}: PropsType) {
    return (
        <div className={classes.container}>
            {attributeName}
            <Slider
                marks
                min={1}
                max={9}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => value}
                value={value}
                onChange={(e, value) => onChange(value as number)}
            />
        </div>
    )
}

export default PrioritySlider