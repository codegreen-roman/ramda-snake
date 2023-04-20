import R from 'ramda'
import * as Rx from '@reactivex/rxjs'

export const refresher = function (change$, startDelay, minDelay) {
    return new Rx.Observable(observer => {

        let delay = startDelay
        let interval = setInterval(() => observer.next(), startDelay)

        change$.subscribe(() => {

            const minus = R.compose(R.add(delay), R.negate)
            const decreaseOrMinDelay = R.ifElse(R.gt(delay), minus, R.identity)

            delay = decreaseOrMinDelay(minDelay)

            clearInterval(interval)
            interval = setInterval(() => observer.next(), delay)
        })

        return () => clearInterval(interval)
    })

}
