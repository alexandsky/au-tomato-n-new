export type PomoSettings = {
    time: {
        work: number,
        break: number,
        rest: number,
    },
    period: number
}

export type PomoPhase = 'work' | 'break' | 'rest';

export type PomoState = {
    cycle: number,
    phase: PomoPhase
}