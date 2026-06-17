import { BaseContext, CallbackQueryContext, EditedMessageContext, MessageContext, PreCheckoutQueryContext } from '../context/context';
import { Middleware } from '../core/types';
export type Handler<T extends BaseContext> = (ctx: T) => any
export type UpdateTypes = "callback_query" | "message" | "pre_checkout_query" | "edited_message";
export type ActionPattern = string | RegExp
export type HearsPattern = string | RegExp

export type EventContextMap = {
    message: MessageContext
    edited_message: EditedMessageContext
    callback_query: CallbackQueryContext
    pre_checkout_query: PreCheckoutQueryContext
}

export type RouterCommand = (name: string, fn: Handler<MessageContext>) => void;
export type RouterHears = (pattern: HearsPattern, fn: Handler<MessageContext>) => void;
export type RouterOn = <E extends UpdateTypes>(event: E, fn: Handler<EventContextMap[E]>) => void;
export type RouterAction = (pattern: ActionPattern, fn: Handler<CallbackQueryContext>) => void

export interface Router {
    middleware: Middleware
    command: RouterCommand
    hears: RouterHears
    on: RouterOn
    action: RouterAction
}