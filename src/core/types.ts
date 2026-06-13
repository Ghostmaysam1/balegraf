import { CallbackQueryContext, Context, EditedMessageContext, MessageContext, PreCheckoutQueryContext } from "../context/context"
export { Context } from "../context/context";

export type Middleware = (ctx: MessageContext | CallbackQueryContext | PreCheckoutQueryContext | Context, next: () => Promise<void>) => Promise<void>

