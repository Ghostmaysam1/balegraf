import type { Context, Middleware } from '../core/types'
import type { EventContextMap, Router, Handler, UpdateTypes } from './types'
import { resolveUpdateType } from '../shared/resolveUpdateType'
import { CallbackQueryContext, MessageContext, PreCheckoutQueryContext } from '../context/context'

export function createRouter(): Router {
    const commands = new Map<string, Handler<MessageContext>[]>()
    const hearsList: Array<{ pattern: RegExp | string; fn: Handler<MessageContext> }> = []
    const events: { [K in UpdateTypes]: Array<Handler<EventContextMap[K]>> } = {
        message: [],
        edited_message: [],
        callback_query: [],
        pre_checkout_query: []
    }
    const actions: Array<{ pattern: string | RegExp, fn: Handler<CallbackQueryContext> }> = []

    const middleware: Middleware = async (ctx, next) => {

        const update_type = resolveUpdateType(ctx.update)
        if (!update_type) {
            await next()
            return
        }

        if (update_type === "message") {
            let text = (ctx as MessageContext).message.text || ''

            // COMMANDS
            if (text.startsWith('/')) {
                const cmd = text.split(' ')[0].slice(1).split('@')[0]

                const list = commands.get(cmd)
                if (list) {
                    for (const fn of list) await fn(ctx as MessageContext)
                    return
                }
            }

            // HEARS
            for (const h of hearsList) {
                if (h.pattern instanceof RegExp) {
                    if (h.pattern.test(text || '')) await h.fn(ctx as MessageContext)
                } else {
                    if (text?.includes(h.pattern)) await h.fn(ctx as MessageContext)
                }
            }

            // EVENTS
            const messageEvents = events.message
            for (const fn of messageEvents) await fn(ctx as MessageContext)
        }
        if (update_type === "callback_query") {

            const data = (ctx as CallbackQueryContext).callbackData

            // ACTIONS

            for (const action of actions) {
                if (action.pattern instanceof RegExp) {
                    if (action.pattern.test(data)) {
                        await action.fn(ctx as CallbackQueryContext)
                    }
                } else {
                    if (action.pattern === data) {
                        await action.fn(ctx as CallbackQueryContext)
                    }
                }
            }

            // EVENTS

            const callbackEvents = events.callback_query
            for (const fn of callbackEvents) await fn(ctx as CallbackQueryContext)
        }
        if (update_type === "pre_checkout_query") {
            const preCheckoutEvents = events.pre_checkout_query
            for (const fn of preCheckoutEvents) await fn(ctx as PreCheckoutQueryContext)
        }
        if (update_type === "edited_message") {
            const editedMessageEvents = events.edited_message
            for (const fn of editedMessageEvents) await fn(ctx as MessageContext)
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
            const list = events[event] as Array<Handler<any>>
            list.push(fn as any)
        },
        action(pattern, fn) {
            actions.push({ pattern, fn })
        }
    }
}