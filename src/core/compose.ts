import { Context, Middleware } from './types'

export function compose(middlewares: Middleware[]) {
    return async (ctx: Context, next?: () => Promise<void>) => {
        let index = -1

        const dispatch = async (i: number): Promise<void> => {
            if (i <= index) {
                throw new Error('next() called multiple times')
            }

            index = i

            const fn = middlewares[i]

            if (!fn) {
                if (next) await next()
                return
            }

            await fn(ctx, () => dispatch(i + 1))
        }

        await dispatch(0)
    }
}