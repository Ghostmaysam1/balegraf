import { BaseContext } from "../context/context"

const storage = new Map();

export const session = async (ctx: BaseContext, next: () => Promise<void>) : Promise<void> => {
    const UNIQ_ID = ctx.chat!.id;

    if(!storage.has(UNIQ_ID)) {
        storage.set(UNIQ_ID, {
            __dev: {},
            __scene: {}
        });
    }

    const userStorage = storage.get(UNIQ_ID);

    Object.defineProperty(ctx, 'session', {
        get: () => userStorage.__dev,
        set: (newValue) => { userStorage.__dev = newValue; },
        configurable: true,
        enumerable: true
    });

    Object.defineProperty(ctx, '__sceneSession', {
        get: () => userStorage.__scene,
        set: (newValue) => { userStorage.__scene = newValue; },
        configurable: true,
        enumerable: false
    });

    await next();

    storage.set(UNIQ_ID, userStorage);
}