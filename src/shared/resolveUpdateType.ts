import { Update } from '../types'
import { UpdateTypes } from '../router/types'

export function resolveUpdateType(update: Update): UpdateTypes {
    if (update.message) return 'message'
    if (update.callback_query) return 'callback_query'
    if (update.pre_checkout_query) return 'pre_checkout_query'
    else return 'edited_message'
}