import { BaseContext } from "../context/context"

const storage = new Map();

export const session = async (ctx: BaseContext, next: () => Promise<void>) : Promise<void> => {
    const UNIQ_ID = ctx.chat!.id;

    if(!storage.has(UNIQ_ID)) {
        storage.set(UNIQ_ID, {});
        ctx.session = {};
    }

    ctx.session = storage.get(UNIQ_ID);

    await next();

    storage.set(UNIQ_ID, ctx.session);
}