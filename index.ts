import { Core } from './src/core/core'
import { Middleware } from './src/core/types';
import { createRouter } from './src/router/router'
import { Handler, UpdateTypes } from './src/router/types';
import { PollingOptions } from './src/types'

export { Markup } from './src/markup/Markup';

export class Balegraf {
    private engine: Core
    private router = createRouter()

    constructor(token: string) {
        this.engine = new Core(token);
    }

    command(name: string, handler: Handler) {
        this.router.command(name, handler)
        return this
    }

    hears(pattern: string | RegExp, handler: Handler) {
        this.router.hears(pattern, handler)
        return this
    }

    on(event: UpdateTypes, handler: Handler) {
        this.router.on(event, handler)
        return this
    }

    use(mw: Middleware) {
        this.engine.use(mw)
        return this
    }

    async launch(options?: PollingOptions) {
        this.engine.use(this.router.middleware);
        this.engine.startPolling(options ?? {});
    }
}