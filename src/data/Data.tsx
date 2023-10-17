import { createContext, useContext, ParentProps } from "solid-js";
import { defaultData, defaultMisc, defaultSettings, defaultState } from "./defaults";
import { Controller } from "../logic";
import { createSignalProxy, loadData, saveData, toDetailedTime } from "../utils";

const DataContext = createContext(defaultData);

export function DataProvider(props: ParentProps) {
    const loadedData = loadData();
    const isLoaded = {
        settings: !!loadedData?.settings,
        state: !!loadedData?.state,
        time: !!loadedData?.time,
        all: !!loadedData?.settings && !!loadedData?.state && !!loadedData?.time,
        any: !!loadedData?.settings || !!loadedData?.state || !!loadedData?.time
    };

    const misc = createSignalProxy(defaultMisc);
    const settings = createSignalProxy(loadedData?.settings ?? defaultSettings);
    const state = createSignalProxy(loadedData?.state ?? defaultState);
    const time = createSignalProxy(loadedData?.time ?? toDetailedTime(settings.time.work * 60));

    addEventListener("beforeunload", () => {
        saveData({
            settings,
            state,
            time
        });
    });

    const controller = new Controller(misc, settings, state, time, isLoaded);

    const store = {
        misc,
        settings,
        state,
        time,
        pause: controller.pause.bind(controller),
        resume: controller.resume.bind(controller),
        start: controller.start.bind(controller),
        stop: controller.stop.bind(controller),
        reset: controller.reset.bind(controller)
    };

    return (
        <DataContext.Provider value={store}>
            {props.children}
        </DataContext.Provider>
    );
}

export function useData() { return useContext(DataContext); }