/**
 * Represents a modal component with customizable options.
 * @module Modal
 * @author Oleksandr Turytsia
 */

import React, { MouseEventHandler, PropsWithChildren } from 'react';
import classes from "./Modal.module.css";
import { FloatingPortal } from '@floating-ui/react';
import { Icon } from '@iconify/react';
import icons, { IconType } from '../../utils/icons';
import { floatingRoot } from '../../App';
import Button from '../Button/Button';

/** Props for the Modal component. */
type PropsType = {
    /** Title of the modal. */
    title: string,
    /** Text for the "Proceed" button. */
    textProceed?: string,
    /** Text for the "Cancel" button. */
    textCancel?: string,
    /** Function to close the modal. */
    onClose: () => void,
    /** Function to submit the modal. */
    onSubmit: () => void,
    /** Error message to display in the modal. */
    error?: string,
    /** Icon for the modal header. */
    icon: IconType,
    /** Additional actions to include in the modal footer. */
    actions?: React.ReactNode
}

/**
 * Prevents click event from bubbling up the DOM.
 * @param e - The mouse event.
 */
const stopPropagation: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
}

/**
 * Modal functional component.
 * @param props - The props for the Modal component.
 * @returns The modal component.
 */
const Modal: React.FC<PropsWithChildren<PropsType>> = ({
    title,
    children,
    error = "",
    textProceed,
    textCancel,
    icon,
    onClose,
    onSubmit,
    actions
}) => {

    return (
        <FloatingPortal root={floatingRoot}>
            <div className={classes.outer} onClick={onClose}>
                <div className={classes.container} onClick={stopPropagation}>
                    <header className={classes.header}>
                        <div className={classes.headerTitle}>
                            <Icon icon={icon} height={25} width={25} />
                            {title}
                        </div>
                        <button className={classes.close} onClick={onClose}>
                            <Icon icon={icons.close} height={25} width={25} />
                        </button>
                    </header>
                    <div className={classes.content}>{children}</div>
                    <footer className={classes.footer}>
                        <div className={classes.errorContainer}>
                            {error && (
                                <>
                                    <Icon icon={icons.error} height={20} width={20} />
                                    <span>{error}</span>
                                </>
                            )}
                        </div>
                        <div className={classes.actions}>
                            {textCancel && (
                                <Button onClick={onClose}>
                                    {textCancel}
                                </Button>
                            )}
                            {textProceed && (
                                <Button style="primary" onClick={onSubmit}>
                                    {textProceed}
                                </Button>
                            )}
                            {actions}
                        </div>
                    </footer>
                </div>
            </div>
        </FloatingPortal>
    );
}

export default Modal;