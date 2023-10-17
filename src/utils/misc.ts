import { createSignal } from "solid-js";
import { DetailedTime, PomoPhase, PomoSettings, PomoState, SerializableData } from "../types";
import { defaultSettings, defaultState, defaultTime } from "../data";
import { toDetailedTime } from "./time";

// various consts
export const MIN_CYCLE = 0;
export const MAX_CYCLE = 1_000_000_000;

export const MIN_SETTING = 1;
export const MAX_TIME_SETTING = 1440;
export const MAX_PERIOD_SETTING = 1000;

export const MIN_TIME = 0;
export const MAX_HOURS = 24;
export const MAX_MINUTES = 59;
export const MAX_SECONDS = 59;

/**
 * Clamps number value
 * @param value - value to clamp
 * @param maxValue - max clamp value
 * @param minValue - min clamp value
 * @returns
 * clamped value (minValue < maxValue) or
 *
 * zero (minValue > maxValue) or
 *
 * minValue (maxValue === minValue)
 */
export function clamp(value: number, maxValue: number, minValue: number = 0) {
    if (minValue > maxValue) {
        return 0;
    }
    if (minValue === maxValue) {
        return minValue;
    }
    return Math.max(Math.min(value, maxValue), minValue);
}

// individual clampers
const clampTimeSetting = (value: number) => clamp(value, MAX_TIME_SETTING, MIN_SETTING);
const clampPeriodSetting = (value: number) => clamp(value, MAX_PERIOD_SETTING, MIN_SETTING);

const clampCycle = (value: number) => clamp(value, MAX_CYCLE, MIN_CYCLE);

const clampHours = (value: number) => clamp(value, MAX_HOURS, MIN_TIME);
const clampMinutes = (value: number) => clamp(value, MAX_MINUTES, MIN_TIME);
const clampSeconds = (value: number) => clamp(value, MAX_SECONDS, MIN_TIME);

// PomoPhase type guard
export function isPomoPhase(value: unknown): value is PomoPhase {
    return value === 'work' ||
        value === 'break' ||
        value === 'rest';
}

/**
 * Deep clones serializable object
 * @param source clone source
 * @returns cloned object or undefined if source is not serializable
 */
export function clone<T extends object>(source: T): T | undefined {
    try {
        return JSON.parse(JSON.stringify(source));
    } catch (error) {
        console.error('Clone source is not serializable!');
        return undefined;
    }
}

/**
 * Loads data object from local storage
 * @param chunkName name of saved object
 * @param defaultChunk default values od that data object
 * @param chunkParser function that handles object parsing
 * @returns loaded object or undefined if loading failed
 */
export function loadChunk<T extends object>(chunkName: string, defaultChunk: T, chunkParser: (chunk: T, parsedChunk: Partial<T>) => T) {
    const chunkString = window.localStorage.getItem(chunkName);

    if (chunkString === null) {
        return;
    }

    try {
        const parsedChunk = JSON.parse(chunkString);
        const chunk = clone(defaultChunk);

        if (chunk === undefined) {
            return;
        }

        return chunkParser(chunk, parsedChunk);
    }
    catch (error) {
        console.error(`Failed to load ${chunkName} data.`);
        return;
    }
}

/**
 * Loads settings from local storage
 * @returns loaded settings or undefined if loading failed
 */
export function loadSettings() {
    return loadChunk(
        'settings',
        defaultSettings,
        (settings, parsedSettings) => {
            for (const key in settings.time) {
                if (typeof parsedSettings?.time?.[key as PomoPhase] === 'number') {
                    settings.time[key as PomoPhase] = clampTimeSetting(parsedSettings.time[key as PomoPhase]);
                }
            }

            if (typeof parsedSettings?.period === 'number') {
                settings.period = clampPeriodSetting(parsedSettings.period);
            }

            return settings;
        });
}

/**
 * Loads state from local storage
 * @returns loaded state or undefined if loading failed
 */
export function loadState() {
    return loadChunk(
        'state',
        defaultState,
        (state, parsedState) => {
            if (typeof parsedState?.cycle === 'number') {
                state.cycle = clampCycle(parsedState.cycle);
            }

            if (isPomoPhase(parsedState?.phase)) {
                state.phase = parsedState.phase;
            }

            return state;
        }
    );
}

/**
 * Loads time from local storage
 * @returns loaded time or undefined if loading failed
 */
export function loadTime() {
    return loadChunk(
        'time',
        defaultTime,
        (time, parsedTime) => {
            if (typeof parsedTime?.hours === 'number') {
                time.hours = clampHours(parsedTime.hours);
            }

            if (time.hours === MAX_HOURS) {
                time.minutes = 0;
                time.seconds = 0;
                return time;
            }

            if (typeof parsedTime?.minutes === 'number') {
                time.minutes = clampMinutes(parsedTime.minutes);
            }

            if (typeof parsedTime.seconds === 'number') {
                time.seconds = clampSeconds(parsedTime.seconds);
            }

            return time;
        }
    );
}

/**
 * Loads serializable app data from local storage
 * @returns Partial of loaded data, due to possible errors 
 */
export function loadData() {
    return {
        settings: loadSettings(),
        state: loadState(),
        time: loadTime()
    } as Partial<SerializableData>;
}

/**
 * Saves data object to local storage
 * @param chunk object to save
 * @param chunkName name for saveable object
 */
export function saveChunk(chunk: PomoSettings | PomoState | DetailedTime, chunkName: string) {
    window.localStorage.setItem(chunkName, JSON.stringify(chunk));
}

/**
 * Saves serializable app data to local storage
 * @param data data to save
 */
export function saveData(data: SerializableData) {
    saveChunk(data.settings, "settings");
    saveChunk(data.state, "state");
    saveChunk(data.time, "time");
}

/**
 * Creates deep reactive proxy for data object
 * @param data data to create proxy from
 * @returns reactive proxy
 */
export function createSignalProxy<T extends object>(data: T) {
    const result: {
        [key: string | symbol]: T[keyof T]
    } = {};

    for (const key in data) {
        if (data[key] !== null && typeof data[key] === 'object') {
            result[key] = createSignalProxy(data[key] as T[keyof T]);
        }
        else {
            const [dataSignal, setDataSignal] = createSignal(data[key]);
            Object.defineProperty(result, key, {
                enumerable: true,
                get() {
                    return dataSignal()
                },
                set(value: T[keyof T]) {
                    setDataSignal(value);
                }
            });
        }
    }

    return result as T;
}

/**
 * Makes reactive proxy serializable, so it would be saveable
 * @param proxy proxy to make serializable
 * @returns serializable object based on proxy
 */
export function makeSignalProxySerializable<T>(proxy: T) {
    const result: {
        [key: string | symbol]: T[keyof T]
    } = {};

    for (const key in proxy) {
        if (proxy[key] !== null && typeof proxy[key] === 'object') {
            result[key] = makeSignalProxySerializable(proxy[key]);
        }
        else {
            result[key] = proxy[key];
        }
    }

    return result as T;
}