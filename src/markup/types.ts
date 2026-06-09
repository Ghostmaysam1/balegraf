import { InlineKeyboardButton, KeyboardButton } from '../types'

export interface ReplyKeyboardMarkup {
    keyboard: KeyboardButton[][]
    resize_keyboard?: boolean
    one_time_keyboard?: boolean
}

export interface InlineKeyboardMarkup {
    inline_keyboard: InlineKeyboardButton[][]
}

export interface ReplyKeyboardRemove {
    remove_keyboard: true
}

export type ReplyMarkup = ReplyKeyboardMarkup | InlineKeyboardMarkup | ReplyKeyboardRemove