import { BaseContext } from "../context/context"

export type Middleware = (ctx: BaseContext, next: () => Promise<void>) => Promise<void> | void
