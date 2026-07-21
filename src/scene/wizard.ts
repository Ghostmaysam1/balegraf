import { SceneContext, SceneMiddleware } from './types';

export class WizardScene<C extends SceneContext = SceneContext> {
    public readonly id: string;
    public readonly steps: SceneMiddleware<C>[];

    constructor(id: string, ...steps: SceneMiddleware<C>[]) {
        this.id = id;
        this.steps = steps;
    }
}