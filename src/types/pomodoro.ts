/**
 * Pomodoro-specific settings
 */
export type PomoSettings = {
    time: {
        work: number,
        break: number,
        rest: number,
    },
    period: number
}

/**
 * Possible pomodoro phases
 */
export type PomoPhase = 'work' | 'break' | 'rest';


/**
 * Pomodoro state
 */
export type PomoState = {
    cycle: number,
    phase: PomoPhase
}