(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const RangeSlider = require('..')
const slider = RangeSlider({min: 0, max: 10})
document.body.append(slider)
},{"..":4}],2:[function(require,module,exports){
module.exports = InputRange

const sheet = new CSSStyleSheet
sheet.replaceSync(getTheme())

const e = document.createElement.bind(document)
function InputRange({ min = 0, max = 100 } = { min: 0, max: 100 }, protocol) {
    const notify = protocol (listen)
    const handlers = {
        onkeyup(e) {
            if (utils.isWiderThan(e.target.min, e.target.value)) return
            actions.ensureRange(e)
        },
        onleave(e) {
            if (utils.isWiderThan(e.target.min, e.target.value)) return e.target.value = ''
            actions.ensureRange(e)
        }
    }
    const utils = {
        isWiderThan(any1, any2) {
            return any1.toString().length > any2.toString().length
        }
    }
    const actions = {
        ensureRange(e) {
            const el = e.target
            const val = new Number(el.value)
            if (val > el.max) el.value = el.max
            else if (val < el.min) el.value = el.min
            if (notify) notify({ type: 'update', data: Number(el.value) })
        }
    }

    const el = e('div')
    const shadow = el.attachShadow({ mode: 'closed' })

    const input = e('input')
    input.type = 'number'
    input.min = min
    input.max = max
    input.onkeyup = handlers.onkeyup
    input.onpointerleave = handlers.onleave
    input.onblur = handlers.onleave

    shadow.appendChild(input)
    shadow.adoptedStyleSheets = [sheet]

    return el

    function listen (message) {
        const { type, data } = message
        if (type === 'update') input.value = data
    }
}

function getTheme() {
    return `
        input {
            padding: 0.5em 1em;
            border-radius: 1em;
        }
    `
}
},{}],3:[function(require,module,exports){
module.exports = RangeSlider

function RangeSlider({ min = 0, max = 100 } = { min: 0, max: 100 }, protocol) {
    const notify = protocol(listen)
    const handlers = {
        oninput(e) {
            const el = e.target
            if (notify) notify({type: 'update', data: Number(el.value)})
            const val = el.value / el.max * 100
            actions.changeWidthTo(val, bar.querySelector('.fill'))
        }
    }
    const utils = {
        el(x) {
            return document.createElement(x)
        },
        div(x, el = 'div') {
            const elm = utils.el(el)
            if (x) elm.classList.add(x)
            return elm
        }
    }
    const actions = {
        changeWidthTo(val, el) {
            el.style.width = `${val}%`
        }
    }

    const el = utils.div()
    const shadow = el.attachShadow({ mode: 'closed' })

    const input = utils.el('input')
    input.type = 'range'
    input.min = min
    input.max = max
    input.value = min
    input.oninput = handlers.oninput

    const bar = utils.div('bar')
    const ruler = utils.div('ruler')
    const fill = utils.div('fill')
    bar.append(ruler, fill)

    const style = utils.el('style')
    style.textContent = getTheme()

    shadow.append(style, input, bar)

    return el

    function listen (message) {
        const { type, data } = message
        if (type === 'update') {
            input.value = data
            const val = data / input.max * 100
            actions.changeWidthTo(val, fill)
            input.focus()
        }
    }
}

function getTheme() {
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
},{}],4:[function(require,module,exports){
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
    range_slider.style.height = '1em'

    const style = utils.el('style')
    style.textContent = getTheme()

    shadow.append(style, range_slider, input_range)

    return el

    function protocol(notify) {
        state.components.push(notify)
        return listen
    }
    function listen(message) {
        const { type, data } = message
        if (type === 'update') state.syncValue(data)
        if (notify) notify(message)
    }

    function listenParent(message) {
        const { type, data } = message
        if (type === 'update') state.syncValue(data)
    }
}

function getTheme() {
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
},{"@v142857/input-range":2,"@v142857/range-slider":3}]},{},[1]);
