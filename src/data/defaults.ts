import { DetailedTime, MiscSettings, PomoSettings, PomoState } from "../types";

export const defaultSettings = {
    time: {
        work: 25,
        break: 5,
        rest: 30
    },
    period: 3
} as PomoSettings;

export const defaultState = {
    cycle: 0,
    phase: 'work'
} as PomoState;

export const defaultMisc = {
    status: {
        settings: 'hidden',
        popup: 'hidden',
        timer: 'stopped'
    },
    message: ''
} as MiscSettings;

export const defaultTime = {
    hours: 0,
    minutes: 25,
    seconds: 0
} as DetailedTime;

export const defaultPopupMessages = {
    work: 'time to work',
    break: 'take a break',
    rest: 'take some rest'
};

export const defaultData = {
    settings: defaultSettings,
    state: defaultState,
    time: defaultTime,
    misc: defaultMisc,
    start: () => { },
    stop: () => { },
    pause: () => { },
    resume: () => { }
};
