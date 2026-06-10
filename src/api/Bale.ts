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

    sendMessage(chatId: string | number, text: string, markup?: ReplyMarkup
    ) {
        return this.callApi('sendMessage', {
            chat_id: chatId,
            text,
            reply_markup: markup || null
        })
    }

    sendPhoto(
        chatId: string | number,
        photo: InputFile,
        options?: MediaOptions
    ) {
        if (!photo.needsUpload) {
            const url_or_id = photo.source;
            
            return this.callApi("sendPhoto", { ...options, photo: url_or_id, chat_id: chatId })
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

            return this.callApi("sendPhoto", form)
        }
    }

    answerCallbackQuery(callbackQueryId: string, text?: string, showAlert?: boolean) {
        return this.callApi('answerCallbackQuery', {
            callback_query_id: callbackQueryId,
            text,
            show_alert: showAlert
        })
    }
}
