import { compose } from './compose'
import { Context } from './context'
import { Middleware, Update } from './types'
import { BaleApi } from '../api/Bale'
import { Polling } from '../transport/pooling'

export class Core {
    api: BaleApi
    polling: Polling
    private middlewares: Middleware[] = []

    constructor(token: string) {
        this.api = new BaleApi({ token })
        this.polling = new Polling(this, this.api);
    }

    use(mw: Middleware) {
        this.middlewares.push(mw)
        return this
    }

    async handleUpdate(update: Update) {
        const ctx = new Context(update, this)

        const pipeline = compose([
            ...this.middlewares
        ])

        await pipeline(ctx)
    }

    async startPolling(options: any) {
        await this.polling.start(options);
    }
}