const InputRange = require('@v142857/input-range')
const RangeSlider = require('@v142857/range-slider')

module.exports = RangeSliderInput

const id = "v142857-range-slider-input"
var count = 0
function RangeSliderInput(opts, protocol) {
    const name = `${id}-${count++}`
    const notify = protocol(listen, name)
    const state = {}
    const el = document.createElement('div')
    const shadow = el.attachShadow({ mode: 'closed' })

    const input_range = InputRange(opts, sub_protocol)
    const range_slider = RangeSlider(opts, sub_protocol)
    range_slider.style.height = '1em'

    const style = document.createElement('style')
    style.textContent = get_theme()

    shadow.append(style, range_slider, input_range)

    return el

    function sub_protocol(notify, from) {
        state[from] = notify
        return sub_listen
    }
    function sub_listen(message) {
        const { head: [from], type } = message
        if (type === 'update')
        for (const [id, notify] of Object.entries(state))
            if (id !== from) notify(message)
        notify({...message, head: [name]})
    }

    function listen(message) {
        if (message.type === 'update') sub_listen(message)
    }
}

function get_theme() {
    return `
        :host {
            display: grid;
            grid-template-columns: 8fr 1fr;
            align-items: center;
        }
        * {
        margin: 1em;
        }
    `
}