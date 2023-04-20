import R from 'ramda'
import {config} from './config'

export const xLens = R.lensProp('x')
export const yLens = R.lensProp('y')

export const lowerEqTen = R.compose(R.not, R.lt(config.LENGTH))
export const graterEqOne = R.compose(R.not, R.gt(1))

export const boundsOk = R.allPass([
    R.compose(lowerEqTen, R.view(xLens)),
    R.compose(graterEqOne, R.view(xLens)),
    R.compose(lowerEqTen, R.view(yLens)),
    R.compose(graterEqOne, R.view(yLens))
])

export const fnMap = {
    'L': R.over(xLens, R.dec),
    'R': R.over(xLens, R.inc),
    'D': R.over(yLens, R.inc),
    'U': R.over(yLens, R.dec),
}
export const getTransformer = letter => fnMap[letter]
export const positionSetter = R.compose(getTransformer, R.prop('direction'))
