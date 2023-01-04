const InputRange = require('@v142857/input-range')
const RangeSlider = require('@v142857/range-slider')

module.exports = RangeSliderInput

const utils = {
    el(tag = 'div') {
        return document.createElement(tag)
    },
    elWithClass(class_name, tag = 'div') {
        const el = utils.el(tag)
        el.classList.add(class_name)
        return el
    }
}

function RangeSliderInput(opts, parentProtocol) {
    const notify = parentProtocol ? parentProtocol(listenParent) : undefined
    const state = {
        components: [],
        syncValue(value) {
            for (const notify of this.components)
                notify({
                    type: 'update',
                    data: value,
                })
        }
    }
    const el = utils.el()
    const shadow = el.attachShadow({ mode: 'closed' })

    const input_range = InputRange(opts, protocol)
    const range_slider = RangeSlider(opts, protocol)
    const output = utils.el()
    output.innerText = 0

    const style = utils.el('style')
    style.textContent = getTheme()

    shadow.append(style, range_slider, input_range, output)

    return el

    function protocol(notify) {
        state.components.push(notify)
        return listen
    }
    function listen(message) {
        const { type, data } = message
        if (type === 'update') {
            output.innerText = data
            state.syncValue(data)
        }
        if (notify) notify(message)
    }

    function listenParent(message) {
        const { type, data } = message
        if (type === 'update') {
            output.innerText = data
            state.syncValue(data)
        }
    }
}

function getTheme() {
    return `
        * {
        margin: 1em;
        }
    `
}