import { BaleApi } from '../api/BaleApi'
import { Core } from '../core/core'
import { Update } from '../core/types'

export class Polling {
    private offset = 0
    private running = false

    constructor(
        private bot: Core,
        private api: BaleApi
    ) { }

    async start(options: any = {}) {
        this.running = true

        const interval = options.intervalMs ?? 1000
        const limit = options.limit ?? 50
        const timeout = options.timeout ?? 20

        while (this.running) {
            try {
                const updates: Update[] =
                    await this.api.getUpdates(this.offset, limit, timeout)

                for (const update of updates) {
                    await this.bot.handleUpdate(update)
                    this.offset = update.update_id + 1
                }
            } catch (err) {
                console.error(err)
                await new Promise(r => setTimeout(r, interval))
            }
        }
    }

    stop() {
        this.running = false
    }
}