import { BaleApi } from '../api/Bale'
import { Core } from '../core/core'
import { PollingOptions, Update } from '../types'

export class Polling {
    private offset = 0
    private running = false

    constructor(
        private bot: Core,
        private api: BaleApi
    ) { }

    async start(options: PollingOptions = {}) {
        this.running = true

        const limit = options.limit ?? 50
        const timeout = options.timeout ?? 20

        while (this.running) {

            try {
                const updates: Update[] = await this.api.getUpdates(this.offset, limit, timeout)
                if(updates.length == 0) continue;

                for (const update of updates) {
                    try {
                        await this.bot.handleUpdate(update)
                    } catch (err) {
                        console.error(err)
                    }

                    this.offset = update.update_id + 1
                }

            } catch (err) {
                console.error(err)
                await sleep(500);
            }
        }
    }

    stop() {
        this.running = false
    }
}

async function sleep(ms: number): Promise<void> {
    await new Promise(r => setInterval(r, ms));
}