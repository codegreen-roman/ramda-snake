import R from 'ramda'
import * as Rx from '@reactivex/rxjs'
import * as util from './util'
import {catchDirection as directionObservable} from './direction-handlers'
import {refresher} from './speed-changer'
import {getExclusiveRandomPosition} from './feed'

(function main() {

    const MAX_DELAY = 800,
        MIN_DELAY = 100,
        INIT_SNAKE_LENGTH = 2,
        INITIAL_X = 10,
        INITIAL_Y = 10

    const body = document.querySelector('body')
    const errorMessenger = document.querySelector('#info div.error')
    const statusCounter = document.querySelector('#info div.counter')

    const gameOver$ = new Rx.Subject()
    const snakeGrow$ = new Rx.Subject()

    const refresh$ = refresher(snakeGrow$, MAX_DELAY, MIN_DELAY)

    // state
    let snakeLength = INIT_SNAKE_LENGTH
    let foodPosition = {}
    let positions = [{
        x: INITIAL_X,
        y: INITIAL_Y
    }]
    // state

    const food = getExclusiveRandomPosition

    const clearCellActiveness = function (className) {
        return () => {
            const cells = document.querySelectorAll('div.cell')
            R.forEach(cell => cell.classList.remove(className))(cells)
        }

    }
    const cellMarker = ({x, y}) => {
        const cell = document.querySelector(`div.line-${x}>.point-${y}`)
        cell.classList.add('active')
    }

    const cellFoodMarker = ({x, y}) => {
        const cell = document.querySelector(`div.line-${x}>.point-${y}`)
        cell.classList.add('food')
        foodPosition = {x, y}
    }

    const theSideEffect = application => {

        const headOfSnake = R.head(positions)
        const nextMove = application(headOfSnake)
        const concat = R.concat([nextMove])

        if (!util.boundsOk(nextMove))
            return gameOver$.next(`Game Over: Out of bounds with x=${nextMove.x}, y=${nextMove.y}`)

        if (R.contains(nextMove, positions))
            return gameOver$.next(`Game Over: Collision`)

        if (R.equals(foodPosition, nextMove))
            snakeGrow$.next()

        positions = R.compose(R.take(snakeLength - 1), concat)(positions)
        R.forEach(cellMarker)(positions)
    }

    const direction$ = directionObservable(body)
        .scan((history, state) => R.compose(R.concat([state]), R.take(snakeLength - 1))(history), [])
        .map(R.map(util.positionSetter))
        .map(R.head)

    refresh$.withLatestFrom(direction$)
        .takeUntil(gameOver$)
        .map(R.last)
        .do(clearCellActiveness('active'))
        .subscribe(theSideEffect)

    gameOver$.subscribe(m => errorMessenger.innerHTML = m)

    snakeGrow$
        .do(clearCellActiveness('food'))
        .subscribe(() => {
            statusCounter.innerHTML = snakeLength - 1
            snakeLength = R.inc(snakeLength)
            cellFoodMarker(food(positions))
        })

    // Initial snake position
    cellMarker(R.head(positions))

    // Initial food position
    cellFoodMarker(food(positions))

})()
