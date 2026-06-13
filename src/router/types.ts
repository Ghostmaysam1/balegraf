import { BaseContext, CallbackQueryContext, MessageContext, PreCheckoutQueryContext } from '../context/context';
import { Context } from '../core/types'

export type Handler<T extends BaseContext> = (ctx: T) => any
export type UpdateTypes = "callback_query" | "message" | "pre_checkout_query" | "edited_message";
export type ActionPattern = string | RegExp
export type HearsPattern = string | RegExp

export type EventContextMap = {
    message: MessageContext
    edited_message: MessageContext
    callback_query: CallbackQueryContext
    pre_checkout_query: PreCheckoutQueryContext
}

export type RouterMiddleware = (ctx: Context | MessageContext | CallbackQueryContext | PreCheckoutQueryContext, next: () => Promise<void>) => Promise<void>;
export type RouterCommand = (name: string, fn: Handler<MessageContext>) => void;
export type RouterHears = (pattern: HearsPattern, fn: Handler<MessageContext>) => void;
export type RouterOn = <E extends UpdateTypes>(event: E, fn: Handler<EventContextMap[E]>) => void;
export type RouterAction = (pattern: ActionPattern, fn: Handler<CallbackQueryContext>) => void

export interface Router {
    middleware: RouterMiddleware
    command: RouterCommand
    hears: RouterHears
    on: RouterOn
    action: RouterAction
}