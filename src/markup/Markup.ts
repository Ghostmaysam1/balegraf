import { InlineKeyboardButton, KeyboardButton } from '../types'
import { ReplyKeyboardMarkup, ReplyKeyboardRemove, InlineKeyboardMarkup } from './types'

export class Markup {
    static keyboard(
        keyboard: KeyboardButton[][]
    ): ReplyKeyboardMarkup {
        return { keyboard };
    }

    static inlineKeyboard(
        inline_keyboard: InlineKeyboardButton[][]
    ): InlineKeyboardMarkup {
        return { inline_keyboard };
    }

    static removeKeyboard(): ReplyKeyboardRemove {
        return {
            remove_keyboard: true,
        };
    }

    static button = {
        text(text: string) {
            return { text };
        },

        contact(text: string) {
            return {
                text,
                request_contact: true,
            };
        },

        location(text: string) {
            return {
                text,
                request_location: true,
            };
        },

        url(text: string, url: string): InlineKeyboardButton {
            return {
                text,
                url,
            };
        },

        callback(
            text: string,
            callback_data: string
        ): InlineKeyboardButton {
            return {
                text,
                callback_data,
            };
        },
    };
}