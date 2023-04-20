import R from 'ramda'
import {config} from './config'

const exclusiveUpper = 1 + config.LENGTH
const inclusiveLower = 1

const dirtyLineBuilder = str => R.compose(
    R.flatten,
    R.map(y => `${str}:${y}`),
    R.range(inclusiveLower)
)(exclusiveUpper)

const buildAllPositions = R.compose(
    R.flatten,
    R.map(dirtyLineBuilder),
    R.range(inclusiveLower)
)

const strFromPositionObj = ({x, y}) => `${x}:${y}`

const objFromPair = ([x, y]) => {
    return {
        x,
        y
    }
}

// parseInt should be used with second arg, but it will be not that good looking
const splitter = R.compose(objFromPair, R.map(parseInt), R.split(':'))
const allPositions = buildAllPositions(exclusiveUpper)
const getRandom = (min, max) => Math.floor(Math.random() * (max - min)) + min

export function getExclusiveRandomPosition(positions) {
    const positionsStrings = R.map(strFromPositionObj)(positions)
    const freePositions = R.without(positionsStrings, allPositions)

    const freeRandomPosition = getRandom(0, (freePositions.length - 1))
    return splitter(freePositions[freeRandomPosition])
}
