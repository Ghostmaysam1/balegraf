const BALE_API_URL = 'https://api.bale.ai/bot'

export interface BaleApiOptions {
    token: string
}

export interface BaleUpdatesResponse {
    ok: boolean
    result: any[]
}

export class BaleApi {
    constructor(private options: BaleApiOptions) {
        if (!options.token) throw new Error('Bale API token is required')
    }

    private getUrl(method: string) {
        return `${BALE_API_URL}${this.options.token}/${method}`
    }

    private async request(method: string, payload: any = {}) {
        const url = this.getUrl(method)
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        if (!res.ok) {
            const text = await res.text()
            throw new Error(`Bale API request failed: ${res.status} ${res.statusText} ${text}`)
        }

        return res.json()
    }

    async getUpdates(offset?: number, limit = 50, timeout = 30) {
        const payload: any = { limit, timeout }
        if (offset !== undefined) payload.offset = offset
        const body = await this.request('getUpdates', payload) as BaleUpdatesResponse
        return body.result ?? []
    }

    async sendMessage(chatId: string | number, text: string) {
        return this.request('sendMessage', {
            chat_id: chatId,
            text,
        })
    }
}
