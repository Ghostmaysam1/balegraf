import { Middleware } from '../core/types';
import { BaseContext } from '../context/context';
import { WizardScene } from './wizard';
import { SceneContext } from './types';

export class Stage {
    private scenes = new Map<string, WizardScene<any>>();

    constructor(scenes: WizardScene<any>[] = []) {
        for (const scene of scenes) {
            this.scenes.set(scene.id, scene);
        }
    }

    /**
     * میدلور اول: تزریق ابزارها (باید اولین چیزی باشد که بعد از سشن اجرا می‌شود)
     * این میدلور تضمین می‌کند که همه هندلرها (حتی bot.command) به ctx.scene دسترسی دارند
     */
    init(): Middleware {
        return async (baseCtx: BaseContext, next: () => Promise<void>) => {
            const ctx = baseCtx as SceneContext;

            if (!ctx.__sceneSession) {
                ctx.__sceneSession = {};
            }

            // ۱. تزریق ابزارهای scene به ctx (در دسترس برای همه)
            ctx.scene = {
                get state() {
                    return ctx.__sceneSession.state || {};
                },
                set state(value: any) {
                    ctx.__sceneSession.state = value;
                },
                enter: async (sceneId: string, initialState = {}) => {
                    const scene = this.scenes.get(sceneId);
                    if (!scene) throw new Error(`[Balegraf] Scene "${sceneId}" not found.`);
                    
                    ctx.__sceneSession = {
                        current: sceneId,
                        state: initialState,
                        cursor: 0,
                    };
                    
                    // اجرای مرحله اول در صورت وجود
                    if (scene.steps && scene.steps.length > 0) {
                        await scene.steps[0](ctx, () => Promise.resolve());
                    }
                },
                leave: async () => {
                    ctx.__sceneSession = {}; 
                },
            };

            // ۲. تزریق ابزارهای wizard
            ctx.wizard = {
                next: () => {
                    if (ctx.__sceneSession) {
                        ctx.__sceneSession.cursor = (ctx.__sceneSession.cursor || 0) + 1;
                    }
                },
                back: () => {
                    if (ctx.__sceneSession) {
                        ctx.__sceneSession.cursor = Math.max(0, (ctx.__sceneSession.cursor || 0) - 1);
                    }
                },
                selectStep: (index: number) => {
                    if (ctx.__sceneSession) {
                        ctx.__sceneSession.cursor = index;
                    }
                }
            };

            // ادامه مسیر برای بقیه میدلورها و هندلرها
            return next();
        };
    }

    /**
     * میدلور دوم: فقط مسیریابی پیام (باید بعد از init اجرا شود)
     * وظیفه این متد فقط این است که پیام را متوقف کند و به داخل سین بفرستد
     */
    middleware(): Middleware {
        return async (baseCtx: BaseContext, next: () => Promise<void>) => {
            const ctx = baseCtx as SceneContext;

            // ۳. مسیریابی پیام
            const currentSceneId = ctx.__sceneSession?.current;

            // اگر کاربر در سینی نیست، اجازه بده پیام به هندلرهای عادی مثل bot.command برود
            if (!currentSceneId) {
                return next();
            }

            const scene = this.scenes.get(currentSceneId);
            
            // اگر سین وجود نداشت (مثلاً حذف شده بود)، از سین خارج شو
            if (!scene) {
                await ctx.scene.leave();
                return next();
            }

            const cursor = ctx.__sceneSession.cursor || 0;
            const currentStepHandler = scene.steps[cursor];

            // اگر مرحله‌ای برای این cursor وجود داشت، پیام را به آن بفرست و متوقف کن
            if (currentStepHandler) {
                // توجه: اینجا next را پاس می‌دهیم تا در صورت نیاز توسعه‌دهنده بتواند پیام را از سین خارج کند
                return currentStepHandler(ctx, next); 
            } else {
                // پایان مراحل سین
                await ctx.scene.leave();
                return next();
            }
        };
    }
}