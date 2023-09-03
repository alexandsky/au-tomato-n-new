import { createSignal, createContext, useContext, ParentProps } from "solid-js";
import { defaultData, defaultMisc, defaultSettings, defaultState, defaultTime } from "./defaults";
import { Controller } from "../logic/controller";

function createSignalProxy<T extends object>(data: T) {
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

const DataContext = createContext(defaultData);

export function DataProvider(props: ParentProps) {

    const misc = createSignalProxy(defaultMisc);
    const settings = createSignalProxy(defaultSettings);
    const state = createSignalProxy(defaultState);
    const time = createSignalProxy(defaultTime);

    const controller = new Controller(misc, settings, state, time);

    const store = {
        misc,
        settings,
        state,
        time,
        pause: controller.pause.bind(controller),
        resume: controller.resume.bind(controller),
        start: controller.start.bind(controller),
        stop: controller.stop.bind(controller)
    };

    return (
        <DataContext.Provider value={store}>
            {props.children}
        </DataContext.Provider>
    );
}

export function useData() { return useContext(DataContext); }