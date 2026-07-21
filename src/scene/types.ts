import { BaseContext } from '../context/context';

// ساختار دیتایی که قراره داخل ctx.session ذخیره بشه
export interface SceneSessionData {
    current?: string;
    state?: any;
    cursor?: number;
}

// توسعه کانتکست پایه Balegraf برای پشتیبانی از متدهای Scene
export interface SceneContext extends BaseContext {
    scene: {
        state: any;
        enter: (sceneId: string, initialState?: any) => Promise<void>;
        leave: () => Promise<void>;
    };
    wizard: {
        next: () => void;
        back: () => void;
        selectStep: (index: number) => void;
    };
}

// تایپ مخصوص میدلورهای سین که SceneContext می‌گیرند
export type SceneMiddleware<C extends SceneContext = SceneContext> = (ctx: C, next: () => Promise<void>) => Promise<void> | void;