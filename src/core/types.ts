import { Context } from "../context/context"
export { Context } from "../context/context";

export type Middleware = (ctx: Context, next: () => Promise<void>) => Promise<void>

