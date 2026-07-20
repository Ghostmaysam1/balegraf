import { InlineKeyboardButtons, KeyboardButtons } from "../types"

export interface ReplyKeyboardMarkup {
    keyboard: KeyboardButtons[][]
    resize_keyboard?: boolean
    one_time_keyboard?: boolean
}

export interface InlineKeyboardMarkup {
    inline_keyboard: InlineKeyboardButtons[][]
}

export interface ReplyKeyboardRemove {
    remove_keyboard: true
}

export type ReplyMarkup = ReplyKeyboardMarkup | InlineKeyboardMarkup | ReplyKeyboardRemove