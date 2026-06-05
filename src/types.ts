export interface Context {
    update: any
    bot?: any
    reply(text: string): Promise<void>
    [key: string]: any
}

export type Middleware = (ctx: Context, next: () => Promise<void>) => Promise<void>
