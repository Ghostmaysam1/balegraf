import { Context } from '../core/types'

export type Handler = (ctx: Context) => any
export type UpdateTypes = "callback_query" | "message" | "pre_checkout_query" | "edited_message";
export type RouterMiddleware = (ctx: Context, next: () => Promise<void>) => Promise<void>;
export type RouterCommand = (name: string, fn: Handler) => void;
export type RouterHears = (pattern: string | RegExp, fn: Handler) => void;
export type RouterOn = (event: UpdateTypes, fn: Handler) => void;

export interface Router {
    middleware: RouterMiddleware
    command: RouterCommand
    hears: RouterHears
    on: RouterOn
}