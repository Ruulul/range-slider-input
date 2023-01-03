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

function RangeSliderInput(opts) {
    const el = utils.el()
    const shadow = el.attachShadow({ mode: 'closed' })

    const input_range = InputRange(opts, listen)
    const range_slider = RangeSlider(opts, listen)
    const output = utils.el()
    output.innerText = 0

    shadow.append(range_slider, input_range, output)

    return el

    function listen (message) {
        const { type, body } = message
        if (type === 'update') output.innerText = body
    } 
}
