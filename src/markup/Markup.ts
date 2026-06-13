import { InlineKeyboardButton, KeyboardButton, TextButton } from '../types'
import { ReplyKeyboardMarkup, ReplyKeyboardRemove, InlineKeyboardMarkup } from './types'

export class Markup {
    static keyboard(
        keyboard: Array<Array<KeyboardButton | string>>
    ): ReplyKeyboardMarkup {
        return {
            keyboard: keyboard.map(row => row.map(item => typeof item === 'string' ? { text: item } : item))
        };
    }

    static inlineKeyboard(
        inline_keyboard: Array<Array<InlineKeyboardButton | TextButton | string>>
    ): InlineKeyboardMarkup {
        return {
            inline_keyboard: inline_keyboard.map(row => row.map(item => typeof item === 'string' ? { text: item } : item))
        };
    }

    static removeKeyboard(): ReplyKeyboardRemove {
        return {
            remove_keyboard: true,
        };
    }

    static button = {
        text(text: string): TextButton {
            return { text };
        },

        contact(text: string): InlineKeyboardButton {
            return {
                text,
                request_contact: true,
            };
        },

        location(text: string): InlineKeyboardButton {
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

        copy(text: string): InlineKeyboardButton {
            return {
                text,
                copy_text: { text },
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