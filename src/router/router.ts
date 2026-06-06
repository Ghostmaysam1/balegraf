import { Middleware } from '../core/types'
import { Router, Handler } from './types'

export function createRouter(): Router {
    const commands = new Map<string, Handler[]>()
    const hearsList: Array<{ pattern: RegExp | string; fn: Handler }> = []

    const middleware: Middleware = async (ctx, next) => {
        const text = ctx.message?.text

        if (typeof text === 'string') {

            // COMMANDS
            if (text.startsWith('/')) {
                const cmd = text.split(' ')[0].slice(1).split('@')[0]

                const list = commands.get(cmd)
                if (list) {
                    for (const fn of list) await fn(ctx)
                    return
                }
            }

            // HEARS
            for (const h of hearsList) {
                if (h.pattern instanceof RegExp) {
                    if (h.pattern.test(text)) await h.fn(ctx)
                } else {
                    if (text.includes(h.pattern)) await h.fn(ctx)
                }
            }
        }

        await next()
    }

    return {
        middleware,
        command(name, fn) {
            const list = commands.get(name) ?? []
            list.push(fn)
            commands.set(name, list)
        },
        hears(pattern, fn) {
            hearsList.push({ pattern, fn })
        }
    }
}