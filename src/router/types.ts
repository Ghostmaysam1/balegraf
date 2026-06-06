import { Context } from '../core/types'

export type Handler = (ctx: Context) => any

export interface Router {
    middleware: (ctx: Context, next: () => Promise<void>) => Promise<void>
    command(name: string, fn: Handler): void
    hears(pattern: RegExp | string, fn: Handler): void
}