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