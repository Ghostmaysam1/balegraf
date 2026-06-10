import type { Core } from '../core/core'
import type { Chat, Update, User, Message, MediaOptions } from '../types'
import type { ReplyMarkup } from '../markup/types'
import type { UpdateTypes } from '../router/types';

import { resolveUpdateType } from '../shared/resolveUpdateType';
import { InputFile } from '../types/inputFile';

export class Context {
    readonly update: Update
    private core: Core
    readonly updateType: UpdateTypes | null

    readonly message?: Update['message']
    readonly callbackQuery?: Update['callback_query']
    readonly callbackData?: string
    readonly user?: User
    readonly chat?: Chat

    constructor(update: Update, core: Core) {
        this.updateType = resolveUpdateType(update)
        this.update = update
        this.core = core

        this.user = this.resolveUser()
        this.chat = this.resolveChat()
        this.message = update.message
        this.callbackQuery = update.callback_query
        this.callbackData = update.callback_query?.data
    }

    get from(): User | undefined {
        return this.user
    }

    get msg(): Message | undefined {
        return this.message
    }

    get match(): string[] | undefined {
        return undefined
    }

    /**
     * Replies to the current update. Only works for message, edited_message, and callback_query updates. Will throw an error if used with pre_checkout_query updates.
     * @param text 
     * @param markup 
     * @returns 
     */
    reply(text: string, markup?: ReplyMarkup) {
        if (!this.chat?.id) throw new Error('Chat not found in update')

        return this.core.api.sendMessage(this.chat.id, text, markup)
    }

    replyWithPhoto(photo: InputFile, options?: MediaOptions) {
        if (!this.chat?.id) throw new Error('Chat not found in update')

        return this.core.api.sendPhoto(this.chat?.id, photo, options)
    }

    editMessageText(text: string, markup?: ReplyMarkup) {
        if (!this.chat?.id) throw new Error('Chat not found in update')

        if (this.updateType == 'callback_query') {
            return this.core.api.editMessageText(this.chat.id, this.callbackQuery?.message?.message_id!, text, markup)
        } else if (this.updateType == 'message') {
            return this.core.api.editMessageText(this.chat.id, this.message?.message_id!, text, markup)
        }
    }

    editMessageCaption(caption: string, markup?: ReplyMarkup) {
        if (!this.chat?.id) throw new Error('Chat not found in update')

        if (this.updateType == 'callback_query') {
            return this.core.api.editMessageCaption(this.chat.id, this.callbackQuery?.message?.message_id!, caption, markup)
        } else if (this.updateType == 'message') {
            return this.core.api.editMessageCaption(this.chat.id, this.message?.message_id!, caption, markup)
        }
    }

    editMessageReplyMarkup(markup: ReplyMarkup) {
        if (!this.chat?.id) throw new Error('Chat not found in update')

        if (this.updateType == 'callback_query') {
            return this.core.api.editMessageReplyMarkup(this.chat.id, this.callbackQuery?.message?.message_id!, markup)
        } else if (this.updateType == 'message') {
            return this.core.api.editMessageReplyMarkup(this.chat.id, this.message?.message_id!, markup)
        }
    }

    deleteMessage() {
        if (!this.chat?.id) throw new Error('Chat not found in update')

        if (this.updateType == 'callback_query') {
            return this.core.api.deleteMessage(this.chat.id, this.callbackQuery?.message?.message_id!)
        } else if (this.updateType == 'message') {
            return this.core.api.deleteMessage(this.chat.id, this.message?.message_id!)
        }

    }

    answerCallbackQuery(text?: string, showAlert?: boolean) {
        if (this.updateType !== "callback_query") throw new Error('answerCallbackQuery can only be used with callback_query updates')
        if (!this.callbackQuery?.id) throw new Error('Callback query ID not found in update')

        return this.core.api.answerCallbackQuery(this.callbackQuery.id, text, showAlert)
    }

    private resolveUser(): User | undefined {
        return (
            this.update.message?.from ??
            this.update.edited_message?.from ??
            this.update.callback_query?.from ??
            this.update.pre_checkout_query?.from
        )
    }

    private resolveChat(): Chat | undefined {
        return (
            this.update.message?.chat ??
            this.update.edited_message?.chat ??
            this.update.callback_query?.message?.chat
        )
    }
}