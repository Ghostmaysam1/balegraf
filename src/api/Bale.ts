const BALE_API_URL = 'https://tapi.bale.ai/bot'
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

        if (!res.ok) {
            const text = await res.text()
            throw new Error(`Bale API request failed: ${res.status} ${res.statusText} ${text}`)
        }

        return res.json()
    }

    async getUpdates(offset?: number, limit = 50, timeout = 30) {
        const payload: any = { limit, timeout }
        if (offset !== undefined) payload.offset = offset
        const body = await this.request('GET', 'getUpdates', payload) as BaleUpdatesResponse
        return body.result ?? []
    }

    async sendMessage(chatId: string | number, text: string) {
        return this.request('POST', 'sendMessage', {
            chat_id: chatId,
            text,
        })
    }
}
