import { Context, Middleware } from './types'

export class BaleBot {
    private middlewares: Middleware[] = []
    private handlers = new Map<string, Array<(ctx: Context) => any>>()
    private commands = new Map<string, Array<(ctx: Context) => any>>()
    private _hears: Array<{ pattern: RegExp | string; handler: (ctx: Context) => any }> = []

    constructor(public options: { token?: string } = {}) { }

    use(mw: Middleware) {
        this.middlewares.push(mw)
        return this
    }

    private async runMiddlewares(ctx: Context, finalNext: () => Promise<void> = async () => { }) {
        let idx = -1
        const runner = async (i: number): Promise<void> => {
            if (i <= idx) return
            idx = i
            const mw = this.middlewares[i]
            if (!mw) {
                await finalNext()
                return
            }
            await mw(ctx, () => runner(i + 1))
        }
        await runner(0)
    }

    on(event: string, handler: (ctx: Context) => any) {
        const arr = this.handlers.get(event) ?? []
        arr.push(handler)
        this.handlers.set(event, arr)
        return this
    }

    command(name: string, handler: (ctx: Context) => any) {
        const arr = this.commands.get(name) ?? []
        arr.push(handler)
        this.commands.set(name, arr)
        return this
    }

    hears(pattern: RegExp | string, handler: (ctx: Context) => any) {
        this._hears.push({ pattern, handler })
        return this
    }

    private async callHandlers(list: Array<(ctx: Context) => any> | undefined, ctx: Context) {
        if (!list) return
        for (const h of list) {
            try {
                await h(ctx)
            } catch (err) {
                console.error('handler error', err)
            }
        }
    }

    private async dispatch(ctx: Context) {
        const update = ctx.update ?? {}

        // message event
        if (update.message) {
            await this.callHandlers(this.handlers.get('message'), ctx)

            const text = update.message.text
            if (typeof text === 'string') {
                if (text.startsWith('/')) {
                    const cmd = text.split(' ')[0].slice(1)
                    await this.callHandlers(this.commands.get(cmd), ctx)
                }

                for (const h of this._hears) {
                    try {
                        if (h.pattern instanceof RegExp) {
                            if (h.pattern.test(text)) await h.handler(ctx)
                        } else {
                            if (text.includes(h.pattern)) await h.handler(ctx)
                        }
                    } catch (err) {
                        console.error('hears handler error', err)
                    }
                }
            }
        }

        await this.callHandlers(this.handlers.get('update'), ctx)
    }

    async handleUpdate(update: any) {
        const ctx: Context = createContext(update, this)
        await this.runMiddlewares(ctx, async () => {
            await this.dispatch(ctx)
        })
    }

    launch() {
        // TODO: start polling/webhook
        console.log('BaleBot.launch() called — implement polling/webhook')
    }
}

function createContext(update: any, bot: BaleBot): Context {
    return {
        update,
        bot,
        reply: async (text: string) => {
            // placeholder reply implementation
            console.log('[reply]', text)
        },
    }
}
