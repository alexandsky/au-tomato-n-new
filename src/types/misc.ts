import { PomoSettings, PomoState } from "./pomodoro";
import { DetailedTime } from "./time";

/**
 * Possible modal window statuses
 */
export type ModalStatus = 'visible' | 'hidden';

/**
 * Possible timer statuses
 */
export type TimerStatus = 'started' | 'stopped' | 'paused' | 'loaded';

/**
 * Miscellaneous app settings
 */
export type MiscSettings = {
    status: {
        settings: ModalStatus,
        popup: ModalStatus,
        timer: TimerStatus
    },
    message: string
}

/**
 * App data type
 */
export type Data = {
    settings: PomoSettings,
    state: PomoState,
    time: DetailedTime,
    misc: MiscSettings,
    start: () => void,
    stop: () => void,
    pause: () => void,
    resume: () => void,
    reset: () => void
}

/**
 * State of loaded data
 */
export type DataLoadedState = {
    settings: boolean,
    state: boolean,
    time: boolean,
    all: boolean,
    any: boolean
}

/**
 * Data that could be saved
 */
export type SerializableData = {
    settings: PomoSettings,
    state: PomoState,
    time: DetailedTime
}