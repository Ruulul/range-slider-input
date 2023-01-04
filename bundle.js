(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = InputRange

const id = 'v142857-input-range'
var count = 0
function InputRange({min, max} = {}, protocol) {
    const name = `${id}-${count++}`
    const notify = protocol(listen, name)
    const el = document.createElement('div')
    const shadow = el.attachShadow({ mode: 'closed' })

    const input = document.createElement('input')
    Object.assign(input, {
        type: 'number',
        min, max,
        oninput: respond,
        onkeyup,
        onblur: onleave,
    })
    if (!min) input.removeAttribute('min')
    if (!max) input.removeAttribute('max')

    const style = document.createElement('style')
    style.textContent = get_theme()

    shadow.append(style, input)

    return el

    function listen(message) {
        const { type, data: { value, min, max } = {} } = message
        if (type === 'update') {
            if (value) input.value = value
            if (min) input.min = min
            if (max) input.max = max
        }
    }
    function respond() {
        notify({ head: [name], type: 'update', data: { value: Number(input.value) } })
    }
    function onkeyup({ target: el }) {
        if (el.min && !is_wider_than(el.min, el.value))
            ensure_range(el)
        respond()
    }
    function onleave({ target: el }) {
        if (el.min && !is_wider_than(el.min, el.value)) 
            ensure_range(el)
        respond()
    }
    function is_wider_than(any1, any2) {
        return any1.toString().length > any2.toString().length
    }
    function ensure_range(el) {
        const val = Number(el.value)
        if (val > el.max) el.value = el.max
        else if (val < el.min) el.value = el.min
    }
}

function get_theme() {
    return `
        input {
            padding: 0.5em 1em;
            border-radius: 1em;
        }
    `
}
},{}],2:[function(require,module,exports){
const RangeSlider = require('..')
const InputRange = require('@v142857/input-range')

const state = {}
const min = InputRange(undefined, protocol('min'))
const max = InputRange(undefined, protocol('max'))
const slider = RangeSlider({min: 0, max: 10}, protocol('slider'))
state.min.notify({type: 'update', data: {value: 0}})
state.max.notify({type: 'update', data: {value: 10}})

document.body.append(min, max, slider)

function protocol(petname) {
    return (notify, id) => {
        state[petname] = { id, notify }
        return listen(petname)
    }
}
function listen(petname) {
    return message => {
        const { type, data } = message
        if (type === 'update')
        switch (petname) {
            case 'min':
            case 'max':
                state.slider.notify({head: [state[petname].id], type: 'update', data: {[petname]: data.value, no_focus: true}})
        }
    }
}
},{"..":3,"@v142857/input-range":1}],3:[function(require,module,exports){
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
},{"@v142857/input-range":1,"@v142857/range-slider":4}],4:[function(require,module,exports){
module.exports = RangeSlider

const id = 'v142857-range-slider'
var count = 0
function RangeSlider({ min = 0, max = 100 } = { min: 0, max: 100 }, protocol) {
    const name = `${id}-${count++}`
    const notify = protocol(listen, name)
    const el = document.createElement('div')
    const shadow = el.attachShadow({ mode: 'closed' })

    const input = document.createElement('input')
    Object.assign(input, {
        type: 'range',
        min, max, value: min,
        oninput,
    })
    const bar = create_with_class('bar')
    const ruler = create_with_class('ruler')
    const fill = create_with_class('fill')
    bar.append(ruler, fill)

    const style = document.createElement('style')
    style.textContent = get_theme()

    shadow.append(style, input, bar)

    return el

    function listen(message) {
        const { type, data: { value, min, max, no_focus } = {} } = message
        if (type === 'update') {
            if (value) input.value = value
            if (min) input.min = min
            if (max) input.max = max
            const val = (input.value - input.min) / (input.max - input.min) * 100
            change_width_to(val, fill)
            if (!no_focus) input.focus()
        }
    }

    function oninput({ target: el }) {
        notify({ head: [name], type: 'update', data: { value: Number(el.value) } })
        const val = (el.value - el.min) / (el.max - el.min) * 100
        change_width_to(val, bar.querySelector('.fill'))
    }

    function change_width_to(val, el) {
        el.style.width = `${val}%`
    }

    function create_with_class(x, tag = 'div') {
        const el = document.createElement(tag)
        if (x) el.classList.add(x)
        return el
    }
}

function get_theme() {
    return `
        :host {
            width: 100%;
            height: 2em;
            position: relative;
        }
        * {
            box-sizing: border-box;
            --transparent: hsla(0, 0%, 0%, 0);
            --grey: hsl(0, 0%, 75%);
            --focus: blue;
        }
        input {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 1em;
            -webkit-appearance: none;
            z-index: 2;
            background-color: var(--transparent);
        }
        .bar {
            position: absolute;
            top: 0;
            left: 0;
            height: 1em;
            width: 100%;
            border-radius: 1em;
            overflow: hidden;
            background-color: var(--transparent);
            display: flex;
            flex-flow: column;
            justify-content: center;
        }
        .ruler {
            position: absolute;
            height: 0.5em;
            width: 100%;
            background-image: repeating-linear-gradient(to right,
                var(--grey) 0,
                var(--grey) 1em,
                white 1em,
                white 1.2em
            );
        }
        .fill {
            position: absolute;
            height: 0.5em;
            width: 0;
            background-color: var(--grey);
            transition: background-color 0.2s;
        }
        input:focus + .bar .fill {
            background-color: var(--focus);
        }
   `
}
},{}]},{},[2]);
