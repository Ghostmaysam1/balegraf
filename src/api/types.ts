import { Update } from "../types"

export interface BaleApiOptions {
    token: string
}

export interface BaleUpdatesOkResponse {
    ok: true
    result: Update[]
}

export interface BaleUpdatesErrorResponse {
    ok: false,
    error_code: number,
    description: string
}