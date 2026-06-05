import { Context, Middleware } from './types'

export class BaleBot {
    private middlewares: Middleware[] = []
    private handlers = new Map<string, Array<(ctx: Context) => any>>()

    constructor(public options: { token?: string } = {}) { }

    use(mw: Middleware) {
        this.middlewares.push(mw)
        return this
    }

    private async runMiddlewares(ctx: Context) {
        let idx = -1
        const runner = async (i: number): Promise<void> => {
            if (i <= idx) return
            idx = i
            const mw = this.middlewares[i]
            if (!mw) return
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
        return this.on(`command:${name}`, handler)
    }

    hears(pattern: RegExp | string, handler: (ctx: Context) => any) {
        return this.on(`hears:${pattern.toString()}`, handler)
    }

    async handleUpdate(update: any) {
        const ctx: Context = createContext(update, this)
        await this.runMiddlewares(ctx)
        // TODO: dispatch to handlers (command/hears/on)
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
