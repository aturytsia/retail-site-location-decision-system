import React, { useState } from 'react'
import Modal from '../../../../../../../../components/Modal/Modal'
import icons from '../../../../../../../../utils/icons'

import classes from "./DefinePrioritiesModal.module.css"
import PrioritySlider from './components/PrioritySlider/PrioritySlider'
import { ScoreMapType } from '../../../../../../../../utils/types'
import Button from '../../../../../../../../components/Button/Button'
import Emph from '../../../../../../../../components/Emph/Emph'

type PropsType = {
    priorities: ScoreMapType
    onClose: () => void
    onAttributeChange: (currentAttribute: string, otherAttribute: string) => (value: number) => void
}

function DefinePrioritiesModal({
    priorities,
    onClose,
    onAttributeChange
}: PropsType) {

    // const { attributes } = useContext(MapContext)

    const [attributeIndex, setAttributeIndex] = useState<number>(0)

    const attributeKyes = Object.keys(priorities)

    const currentAttribute = attributeKyes[attributeIndex]

    const getNextAttribute = () => {
        setAttributeIndex(prev => (prev + 1) < attributeKyes.length ? prev + 1 : prev)
    }

    const getPreviousAttribute = () => {
        setAttributeIndex(prev => (prev - 1) >= 0 ? prev - 1 : prev)
    }

    const otherAttributes = Object.keys(priorities[currentAttribute])

    return (
        <Modal
            title="Compare attributes"
            onClose={onClose}
            onSubmit={onClose}
            icon={icons.compare}
            actions={
                <>
                    {attributeIndex !== 0 && <Button onClick={getPreviousAttribute}>Back</Button>}
                    {attributeIndex !== (attributeKyes.length - 1) && <Button style="primary"  onClick={getNextAttribute}>Next</Button>}
                    {attributeIndex === (attributeKyes.length - 1) && <Button style="primary"  onClick={onClose}>Done</Button>}
                </>
            }>
            <div className={classes.container}>
                <p>Please compare attribute <Emph>{currentAttribute}</Emph> against others:</p>
                <p className={classes.hint}>
                    For example if you specify value 5 for {otherAttributes[0]} it would be the same as if you said that {currentAttribute} is 5 times more important than {otherAttributes[0]}.
                </p>
                <div className={classes.sliders}>
                    {otherAttributes.map((otherAttribute, i) => (
                        <PrioritySlider
                            key={i}
                            value={priorities[currentAttribute][otherAttribute]}
                            attributeName={otherAttribute}
                            onChange={onAttributeChange(currentAttribute, otherAttribute)}
                        />
                    ))}
                </div>
            </div>
        </Modal>
    )
}

export default DefinePrioritiesModal