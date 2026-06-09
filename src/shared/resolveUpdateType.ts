import { Update } from '../types'
import { UpdateTypes } from '../router/types'

export function resolveUpdateType(update: Update): UpdateTypes | null {
    if (update.callback_query) return 'callback_query'
    if (update.message) return 'message'
    if (update.pre_checkout_query) return 'pre_checkout_query'
    if (update.edited_message) return 'edited_message'
    return null
}