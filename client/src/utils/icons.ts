/**
 * Provides a mapping of icon names to their corresponding icon symbols or classes.
 * @module Icons
 */

/**
 * Object mapping icon names to their corresponding icon symbols or classes.
 */
const icons = {
    home: "material-symbols:home",
    map: "material-symbols:map",
    location: "mdi:location",
    attributes: "icon-park-outline:list",
    compare: "mingcute:git-compare-fill",
    done: "material-symbols:done-all",
    delete: "ic:baseline-delete",
    close: "material-symbols:close",
    warning: "fe:warning",
    plus: "ic:baseline-plus",
    arrowLeft: "iconamoon:arrow-left-2",
    arrowRight: "iconamoon:arrow-right-2",
    check:"material-symbols:check",
    gears: "material-symbols:settings",
    numbersOff: "mdi:numbers-off",
    abcOff: "mdi:abc-off",
    arrowUp: 'iconamoon:arrow-up-2-light',
    arrowDown: 'iconamoon:arrow-down-2-light',
    back: "iconamoon:arrow-left-2",
    layers: "material-symbols:layers",
    data: "bxs:data",
    open: "majesticons:open",
    error: "material-symbols:error",
    restart: "iconamoon:restart-bold",
    star: "tabler:star-filled"
}

/**
 * Represents the type of icons available.
 */
export type IconType = typeof icons[keyof typeof icons]

export default icons
