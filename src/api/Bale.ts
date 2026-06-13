const BALE_API_URL = 'https://tapi.bale.ai/bot'
import { ReplyMarkup } from '../markup/types';
import { BaleApiOptions, BaleUpdatesResponse } from './types'
import { InputFile } from '../types/inputFile';
import { MediaOptions } from '../types';
import FormData from 'form-data'
import axios from 'axios'


export class BaleApi {
    constructor(private options: BaleApiOptions) {
        if (!options.token) throw new Error('Bale API token is required')
    }

    private getUrl(request: string): string {
        const url = `${BALE_API_URL}${this.options.token}/${request}`;
        return url;
    }

    private async callApi(request: string, payload: any = {}) {
        let url = this.getUrl(request)

        const res = await axios.post(url, payload)
        return res.data
    }

    async getUpdates(offset?: number, limit = 100, timeout = 5) {
        const payload: any = { limit, timeout }

        if (offset !== undefined) payload.offset = offset

        const url = this.getUrl('getUpdates');
        const body = (await axios.get(url, { params: payload })).data as BaleUpdatesResponse

        return body.result ?? []
    }

    sendMessage(chat_id: string | number, text: string, reply_markup?: ReplyMarkup
    ) {
        return this.callApi('sendMessage', {
            chat_id,
            text,
            ...(reply_markup && {
                reply_markup
            })
        })
    }

    editMessageText(chat_id: string | number, message_id: string | number, text: string, reply_markup?: ReplyMarkup) {
        return this.callApi('editMessageText', {
            chat_id,
            message_id,
            text,
            ...(reply_markup && {
                reply_markup
            })
        })
    }

    editMessageCaption(chat_id: string | number, message_id: string | number, caption: string, reply_markup?: ReplyMarkup) {
        return this.callApi('editMessageCaption', {
            chat_id,
            message_id,
            caption,
            ...(reply_markup && {
                reply_markup
            })
        })
    }

    editMessageReplyMarkup(chat_id: string | number, message_id: string | number, reply_markup: ReplyMarkup) {
        return this.callApi('editMessageReplyMarkup', {
            chat_id,
            message_id,
            reply_markup
        })
    }

    deleteMessage(chat_id: string | number, message_id: string | number) {
        return this.callApi('deleteMessage', {
            chat_id,
            message_id
        })
    }

    sendPhoto(
        chatId: string | number,
        photo: InputFile,
        options?: MediaOptions
    ) {
        if (!photo.needsUpload) {
            const url_or_id = photo.source;
            let normalized_options = {
                caption: options?.caption,
                reply_markup: options?.replyMarkup,
                reply_to_message_id: options?.replyToMessageId
            }
            return this.callApi("sendPhoto", { ...normalized_options, photo: url_or_id, chat_id: chatId })
        }
        else {
            const form = new FormData()

            form.append('chat_id', String(chatId))
            form.append('from_chat_id', String(chatId))

            form.append(
                'photo',
                photo.source
            )

            if (options?.caption) {
                form.append('caption', options.caption)
            }

            if (options?.replyMarkup) {
                form.append('reply_markup', JSON.stringify(options.replyMarkup, null, 2))
            }

            if (options?.replyToMessageId) {
                form.append('reply_to_message_id', options.replyToMessageId)
            }

            return this.callApi("sendPhoto", form)
        }
    }

    answerCallbackQuery(callback_query_id: string, text?: string, show_alert?: boolean) {
        return this.callApi('answerCallbackQuery', {
            callback_query_id,
            text,
            show_alert
        })
    }


    answerPreCheckoutQuery(pre_checkout_query_id: string, ok: boolean, error_message?: string) {
        return this.callApi('answerPreCheckoutQuery', {
            pre_checkout_query_id,
            ok,
            error_message
        })
    }
}
