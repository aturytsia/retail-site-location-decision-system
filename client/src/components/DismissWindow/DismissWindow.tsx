/**
 * Represents a component that provides a dismissible floating window.
 * @module DismissWindow
 * @author Oleksandr Turytsia
 */
import React, { useState, cloneElement, useRef, useMemo, useEffect, ReactElement, JSXElementConstructor } from "react"
import { floatingRoot } from "../../App"
import { placements } from "../../utils/utils"

import {
    FloatingPortal,
    useInteractions,
    useFloating,
    arrow,
    flip,
    shift,
    autoUpdate,
    offset,
    useDismiss,
    Boundary,
    size,
    hide,
    useClick,
} from "@floating-ui/react"

import classNames from "classnames"
import classes from './DismissWindow.module.css'

/**
 * Props for the DismissWindow component.
 */
type PropsType = {
    /** Function that returns the content of the window and manages its visibility. */
    children: (setIsActive: React.Dispatch<React.SetStateAction<boolean>>) => React.ReactNode,
    /** Function that returns the element that toggles the window and manages its interaction. */
    element: (isActive: boolean) => ReactElement<any, string | JSXElementConstructor<any>>,
    /** Modal window placement. */
    placement?: placements,
    /** Align window width with element (default = false). */
    align?: boolean,
    /** Enable arrow (default = false). */
    enableArrows?: boolean,
    /** Dismiss on click (default = false). */
    dismissOnClick?: boolean,
    /** Outer boundaries (default = document). */
    boundary?: string | null,
    /** Offset from element (default = 10). */
    offset?: number,
    /** Disable window (default = false). */
    disabled?: boolean,
}

/**
 * DismissWindow functional component.
 * @param props - The props for the DismissWindow component.
 * @returns DismissWindow component.
 */
const DismissWindow: React.FC<PropsType> = ({
    children,
    element: Element,
    placement = placements.TOP,
    align = false,
    enableArrows = false,
    dismissOnClick = false,
    boundary = null,
    offset: defaultOffset = 10,
    disabled = false
}) => {

    const [isActive, setIsActive] = useState<boolean>(false);
    const arrowRef = useRef<HTMLDivElement>(null);

    const {
        x, // x position of the floating element
        y, // y position of the floating element
        refs, // DismissWindow refs
        strategy, // position type (relative | absolute)
        context, // context
        placement: floatingPlacement,  // actual placement
        middlewareData,
    } = useFloating({
        placement, // placement of the DismissWindow relatively to its parent
        open: isActive, // state
        onOpenChange: setIsActive,
        middleware: [
            // flip placements
            flip({ 
                boundary: boundary === null ? document.body as Boundary : document.querySelector(boundary) as Boundary,
                fallbackPlacements: ["top"],
             }),
            // shift placements
            shift(),
            // arrow set up
            arrow({ element: arrowRef }),
            size({
                apply({ rects, elements }) {
                    if (align) {
                        elements.floating.style.width = rects.reference.width + "px";
                    }
                },
            }),
            hide(),
            // offset set up
            offset(defaultOffset),
        ],
        // auto update for scrolling and resizing
        whileElementsMounted: (reference, floating, update) =>
            autoUpdate(reference, floating, update, { elementResize: true, ancestorScroll: true }),
    });

    // Hover set up for the floating element
    const { getReferenceProps, getFloatingProps } = useInteractions([
        useClick(context, { enabled: !disabled }),
        useDismiss(context),
    ]);

    // Closes dropdown on scroll when it's hidden for the user.
    useEffect(() => {
        if (middlewareData?.hide?.referenceHidden) {
            setIsActive(false);
        }
    }, [middlewareData]);

    // Calculates arrow style
    const arrowStyles = useMemo(
        () => classNames({
            [classes.popoverArrowTop]: floatingPlacement.split("-")[0] === placements.BOTTOM,
            [classes.popoverArrowRight]: floatingPlacement.split("-")[0] === placements.LEFT,
            [classes.popoverArrowBottom]: floatingPlacement.split("-")[0] === placements.TOP,
            [classes.popoverArrowLeft]: floatingPlacement.split("-")[0] === placements.RIGHT,
        }),
        [floatingPlacement]
    );

    return (
        <>
            {cloneElement(Element(isActive), { ref: refs.setReference, ...getReferenceProps() })}
            <FloatingPortal root={floatingRoot}>
                {isActive && cloneElement(
                    children(setIsActive) as ReactElement<any, string | JSXElementConstructor<any>>,
                    {
                        ref: refs.setFloating,
                        style: {
                            position: strategy,
                            top: y ?? 0,
                            left: x ?? 0,
                        } as unknown as CSSStyleDeclaration,
                        ...getFloatingProps(),
                        ...(dismissOnClick ? getReferenceProps() : {}),
                    },
                    <>
                        {enableArrows && (
                            <div
                                className={arrowStyles}
                                ref={arrowRef}
                                style={{
                                    position: "absolute",
                                    left: `${middlewareData?.arrow?.x}px`,
                                    top: `${middlewareData?.arrow?.y}px`,
                                    borderTopColor: "inherit",
                                    borderBottomColor: "inherit",
                                }}
                            ></div>
                        )}
                        {(children(setIsActive) as ReactElement<any, string | JSXElementConstructor<any>>).props.children}
                    </>
                )}
            </FloatingPortal>
        </>
    );
}

export default DismissWindow;