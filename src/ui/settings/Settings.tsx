import { useData } from "../../data";
import { MAX_PERIOD_SETTING, MAX_TIME_SETTING, makeSignalProxySerializable, saveChunk, toDetailedTime } from "../../utils";
import cross from '../../assets/icons/cross.svg';
import SettingsItem from "./settings-item/SettingsItem";
import './settings.sass';
import { SettingsHint } from "./settings-hint/SettingsHint";

export default function Settings() {

    const { time, settings, misc } = useData();

    function handleClose() {
        misc.status.settings = 'hidden';
        if (misc.status.timer === 'stopped') {
            Object.assign(time, toDetailedTime(settings.time.work * 60));
        }
    }

    const changeHandlers = {
        work: (value: number) => settings.time.work = value,
        break: (value: number) => settings.time.break = value,
        rest: (value: number) => settings.time.rest = value,
        period: (value: number) => settings.period = value,
    }

    return (
        <div
            class="settings"
        >
            <header>
                <p>settings</p>
                <button onClick={handleClose}>
                    <img src={cross} />
                </button>
            </header>

            <main>
                <SettingsItem
                    label={'work time (mins)'}
                    value={settings.time.work}
                    max={MAX_TIME_SETTING}
                    onChange={changeHandlers.work}
                    hint={<SettingsHint text="Work phase time in minutes" />}
                />
                <SettingsItem
                    label={'break time (mins)'}
                    value={settings.time.break}
                    max={MAX_TIME_SETTING}
                    onChange={changeHandlers.break}
                    hint={<SettingsHint text="Break phase time in minutes" />}
                />
                <SettingsItem
                    label={'rest time (mins)'}
                    value={settings.time.rest}
                    max={MAX_TIME_SETTING}
                    onChange={changeHandlers.rest}
                    hint={<SettingsHint text="Every n-th cycle break will have different duration (typically, longer). This value represents duration of that long break (a.k.a. rest) in minutes" />}
                />
                <SettingsItem
                    label={'rest period (cycles)'}
                    max={MAX_PERIOD_SETTING}
                    value={settings.period}
                    onChange={changeHandlers.period}
                    hint={<SettingsHint text="Every n-th cycle break will have different duration (typically, longer). This value represents number 'n' in 'n-th'" />}
                />
            </main>

            <footer class="message">
                <p>
                    settings will be&nbsp;applied automatically, as&nbsp;soon as&nbsp;you close this menu
                </p>
            </footer>
        </div>
    );
}