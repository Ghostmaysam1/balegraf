const BALE_API_URL = 'https://tapi.bale.ai/bot'
import { Markup } from '../markup/Markup';
import { BaleApiOptions, BaleUpdatesResponse } from './types'



export class BaleApi {
    constructor(private options: BaleApiOptions) {
        if (!options.token) throw new Error('Bale API token is required')
    }

    private getUrl(requestURL: string): string {
        const url = new URL(`${this.options.token}/${requestURL}`, BALE_API_URL).href;
        return url;
    }

    private async request(method: "GET" | "POST", requestURL: string, payload: any = {}) {
        let url = this.getUrl(requestURL)

        const options: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        }

        if (method === 'GET') {
            const params = new URLSearchParams(payload as Record<string, string>)
            const query = params.toString()
            if (query) {
                url += `?${query}`
            }
        } else {
            options.body = JSON.stringify(payload)
        }

        const res = await fetch(url, options)
        return res.json()
    }

    async getUpdates(offset?: number, limit = 100, timeout = 5) {
        const payload: any = { limit, timeout }
        if (offset !== undefined) payload.offset = offset
        const body = await this.request('GET', 'getUpdates', payload) as BaleUpdatesResponse
        return body.result ?? []
    }

    sendMessage(chatId: string | number, text: string, markup?: Markup
    ) {
        return this.request('POST', 'sendMessage', {
            chat_id: chatId,
            text,
            reply_markup: markup || null
        })
    }

    answerCallbackQuery(callbackQueryId: string, text?: string, showAlert?: boolean) {
        return this.request('POST', 'answerCallbackQuery', {
            callback_query_id: callbackQueryId,
            text,
            show_alert: showAlert
        })
    }
}
