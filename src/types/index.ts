export type PollingOptions = {
    intervalMs?: number
    limit?: number
    timeout?: number
}

export interface Update {
    update_id: number,
    message?: Message,
    edited_message?: Message,
    callback_query?: CallbackQuery,
    pre_checkout_query?: PreCheckoutQuery
}

interface PreCheckoutQuery {
    id: string,
    from: User,
    currency: string,
    total_amount: number,
    invoice_payload: string
}

interface CallbackQuery {
    id: string,
    from: User,
    message?: Message,
    data?: string
}

interface Message {
    message_id: number,
    from?: User,
    date: number,
    chat: Chat,
    sender_chat?: Chat,
    forward_from?: User,
    forward_from_chat?: Chat,
    forward_from_message_id?: number,
    forward_date?: number,
    reply_to_message?: Message,
    edit_date?: number,
    media_group_id?: string,
    text?: string,
    entities?: MessageEntity[],
    animation?: Animation,
    audio?: Audio,
    document?: Document,
    photo?: PhotoSize[],
    sticker?: Sticker,
    video?: Video,
    voice?: Voice,
    caption?: string,
    caption_entities?: MessageEntity[],
    contact?: Contact,
    location?: Location,
    new_chat_members?: User[],
    left_chat_member?: User,
    invoice?: Invoice,
    successful_payment?: SuccessfulPayment,
    web_app_data?: WebAppData,
    reply_markup?: InlineKeyboardButton
}

interface User {
    id?: number,
    is_bot: boolean,
    first_name: string,
    last_name?: string,
    username?: string,
    language_code?: string
}

interface Chat {
    id: number,
    type: "private" | "group" | "channel",
    title?: string,
    username?: string,
    first_name?: string,
    last_name?: string
}

interface MessageEntity {
    type: "mention" | "bot_command",
    offset: number,
    length: number
}

interface Document {
    file_id: string,
    file_unique_id?: string,
    thumbnail?: PhotoSize,
    file_name?: string,
    mime_type?: string,
    file_size?: number
}

interface Animation {
    file_id: string,
    file_unique_id: string,
    width: string,
    height: string,
    duration: number,
    thumbnail?: PhotoSize,
    file_name?: string,
    mime_type?: string,
    file_size?: number
}

interface Video {
    file_id: string,
    file_unique_id: string,
    width: string,
    height: string,
    duration: number,
    file_name?: string,
    mime_type?: string,
    file_size?: number
}

interface Voice {
    file_id: string,
    file_unique_id: string
}

interface Sticker {
    file_id: string,
    file_unique_id: string,
    type: "regular" | "mask",
    width: string,
    height: string,
    file_size?: number
}

interface Audio {
    file_id: string,
    file_unique_id: string,
    duration: number,
    title?: string,
    file_name?: string,
    mime_type?: string,
    file_size?: number
}

interface PhotoSize {
    file_id: string,
    file_unique_id: string,
    width: number,
    height: number,
    file_size?: number
}

interface Contact {
    phone_number: string,
    first_name: string,
    last_name?: string,
    user_id?: number
}

interface Location {
    longitude: number,
    latitude: number
}

interface Invoice {
    title: string,
    description: string,
    total_amount: number
}

interface SuccessfulPayment {
    currency: string,
    total_amount: number,
    invoice_payload: string,
    telegram_payment_charge_id: string,
    provider_payment_charge_id: string
}

interface WebAppData {
    data: string
}

interface WebAppInfo {
    url: string
}

interface InlineKeyboardButton {
    text: string,
    url?: string,
    callback_data?: string,
    web_app?: WebAppInfo,
    copy_text?: CopyTextButton
}

interface CopyTextButton {
    text: string
}