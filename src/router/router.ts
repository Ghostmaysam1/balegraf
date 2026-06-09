import type { Middleware } from '../core/types'
import type { Router, Handler, UpdateTypes } from './types'
import {resolveUpdateType} from '../shared/resolveUpdateType'

export function createRouter(): Router {
    const commands = new Map<string, Handler[]>()
    const hearsList: Array<{ pattern: RegExp | string; fn: Handler }> = []
    const events = new Map<UpdateTypes, Handler[]>()

    const middleware: Middleware = async (ctx, next) => {

        const update_type = resolveUpdateType(ctx.update)
        if (!update_type) {
            await next()
            return
        }

        if (update_type === "message") {
            let text = ctx.message?.text || ''

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
                    if (h.pattern.test(text || '')) await h.fn(ctx)
                } else {
                    if (text?.includes(h.pattern)) await h.fn(ctx)
                }
            }

            // EVENTS
            const messageEvents = events.get('message')
            if (messageEvents) {
                for (const fn of messageEvents) await fn(ctx)
            }
        }
        if (update_type === "callback_query") {
            const callbackEvents = events.get('callback_query')
            if (callbackEvents) {
                for (const fn of callbackEvents) await fn(ctx)
            }
        }
        if (update_type === "pre_checkout_query") {
            const preCheckoutEvents = events.get('pre_checkout_query')
            if (preCheckoutEvents) {
                for (const fn of preCheckoutEvents) await fn(ctx)
            }
        }
        if (update_type === "edited_message") {
            const editedMessageEvents = events.get('edited_message')
            if (editedMessageEvents) {
                for (const fn of editedMessageEvents) await fn(ctx)
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
        },
        on(event, fn) {
            // Implementation for handling different events
            const list = events.get(event) ?? []
            list.push(fn)
            events.set(event, list)
        }
    }
}