import * as Rx from '@reactivex/rxjs'
import {keyCodes} from './codes'

const stateMaker = function (direction) {
    return function (key) {
        return {direction, move: key}
    }
}

/**
 *
 * @param element to add events to
 * @returns {Observable} of any arrow keys downs
 */
export function catchDirection(element) {

    const keyDown$ = Rx.Observable.fromEvent(element, 'keydown')
        .do(e => !e.metaKey && e.preventDefault())
        .map(e => keyCodes[e.keyCode])

    const leftArrow$ = keyDown$
        .filter(key => key.match('left arrow'))
        .map(stateMaker('L'))

    const upArrow$ = keyDown$
        .filter(key => key.match('up arrow'))
        .map(stateMaker('U'))

    const rightArrow$ = keyDown$
        .filter(key => key.match('right arrow'))
        .map(stateMaker('R'))

    const downArrow$ = keyDown$
        .filter(key => key.match('down arrow'))
        .map(stateMaker('D'))

    return Rx.Observable.merge(leftArrow$, upArrow$, rightArrow$, downArrow$)

}
