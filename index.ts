import { Core } from './src/core/core'
import { createRouter } from './src/router/router'

export class Balegraf {
    private engine: Core
    private router = createRouter()

    constructor(token: string) {
        this.engine = new Core(token);
        this.engine.use(this.router.middleware);
    }

    command(name: string, handler: (ctx: any) => Promise<void>) {
        this.router.command(name, handler)
        return this
    }

    hears(pattern: string | RegExp, handler: (ctx: any) => Promise<void>) {
        this.router.hears(pattern, handler)
        return this
    }

    use(mw: any) {
        this.engine.use(mw)
        return this
    }

    async launch(options?: any) {
        this.engine.startPolling(options)
    }
}