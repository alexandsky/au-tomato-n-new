import { useData } from "../../data";
import cross from '../../assets/icons/cross.svg';
import SettingsItem from "./settings-item/SettingsItem";
import './settings.sass';
import { toDetailedTime } from "../../utils";

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
                    onChange={changeHandlers.work}
                />
                <SettingsItem
                    label={'break time (mins)'}
                    value={settings.time.break}
                    onChange={changeHandlers.break}
                />
                <SettingsItem
                    label={'rest time (mins)'}
                    value={settings.time.rest}
                    onChange={changeHandlers.rest}
                />
                <SettingsItem
                    label={'rest period (cycles)'}
                    max={100}
                    value={settings.period}
                    onChange={changeHandlers.period}
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