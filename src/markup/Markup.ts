import { CallbackButton, ContactButton, CopytextButton, InlineKeyboardButtons, KeyboardButtons, LocationButton, TextButton, UrlButton } from '../types'
import { ReplyKeyboardMarkup, ReplyKeyboardRemove, InlineKeyboardMarkup } from './types'

export class Markup {
    static keyboard(
        keyboard: Array<Array<KeyboardButtons>>,
        options?: {
            resize_keyboard?: boolean,
            one_time_keyboard?: boolean
        }
    ): ReplyKeyboardMarkup {
        return {
            keyboard: keyboard.map(row => row.map(item => typeof item === 'string' ? { text: item } : item)),
            ...(options && (options))
        };
    }

    static inlineKeyboard(
        inline_keyboard: Array<Array<InlineKeyboardButtons>>
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

        contact(text: string): ContactButton {
            return {
                text,
                request_contact: true,
            };
        },

        location(text: string): LocationButton {
            return {
                text,
                request_location: true,
            };
        },

        url(text: string, url: string): UrlButton {
            return {
                text,
                url,
            };
        },

        copy(text: string, copy_text: string): CopytextButton {
            return {
                text,
                copy_text: { text: copy_text },
            };
        },

        callback(
            text: string,
            callback_data: string
        ): CallbackButton {
            return {
                text,
                callback_data,
            };
        },
    };
}