import { Core } from './core'
import { Update } from './types'

export class Context {
    update: Update
    core: Core

    message?: Update['message']
    callbackQuery?: Update['callback_query']

    reply: (text: string) => Promise<void>

    constructor(update: Update, core: Core) {
        this.update = update
        this.core = core

        this.message = update.message
        this.callbackQuery = update.callback_query

        this.reply = async (text: string) => {
            if (!this.core.api) throw new Error('API not initialized')

            const chatId =
                update.message?.chat?.id ??
                update.callback_query?.message?.chat?.id

            if (!chatId) {
                throw new Error('Cannot resolve chat id')
            }

            return this.core.api.sendMessage(chatId, text)
        }
    }
}