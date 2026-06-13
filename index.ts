import { BaleApi } from './src/api/Bale';
import { Core } from './src/core/core'
import { Middleware } from './src/core/types';
import { createRouter } from './src/router/router'
import { ActionPattern, EventContextMap, Handler, HearsPattern, UpdateTypes } from './src/router/types';
import { PollingOptions } from './src/types'
import { BaseContext, CallbackQueryContext, MessageContext, PreCheckoutQueryContext } from './src/context/context';
import { Context } from './src/core/types'

export { Markup } from './src/markup/Markup';
export { InputFile } from './src/types/inputFile'

export class Balegraf {
    private engine: Core
    private router = createRouter()

    constructor(token: string) {
        this.engine = new Core(token)
    }

    get api(): BaleApi {
        return this.engine.api
    }

    command(name: string, handler: Handler<MessageContext>) {
        this.router.command(name, handler)
        return this
    }

    hears(pattern: HearsPattern, handler: Handler<MessageContext>) {
        this.router.hears(pattern, handler)
        return this
    }

    on<E extends UpdateTypes>(event: E, handler: Handler<EventContextMap[E]>) {
        this.router.on(event, handler)
        return this
    }

    use(mw: Middleware) {
        this.engine.use(mw)
        return this
    }

    action(pattern: ActionPattern, handler: Handler<CallbackQueryContext>) {
        this.router.action(pattern, handler);
        return this
    }

    async launch(options?: PollingOptions) {
        this.engine.use(this.router.middleware);
        this.engine.startPolling(options ?? {});
    }
}