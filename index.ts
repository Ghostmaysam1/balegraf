import { Core } from './src/core/core'
import { Context, Middleware } from './src/core/types';
import { createRouter } from './src/router/router'

export class Balegraf {
    private engine: Core
    private router = createRouter()

    constructor(token: string) {
        this.engine = new Core(token);
    }

    command(name: string, handler: (ctx: Context) => Promise<void>) {
        this.router.command(name, handler)
        return this
    }

    hears(pattern: string | RegExp, handler: (ctx: Context) => Promise<void>) {
        this.router.hears(pattern, handler)
        return this
    }

    use(mw: Middleware) {
        this.engine.use(mw)
        return this
    }

    async launch(options?: any) {
        this.engine.use(this.router.middleware);
        this.engine.startPolling(options)
    }
}