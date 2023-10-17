import { useData } from '../data';
import Controls from './controls/Controls';
import Popup from './popup/Popup';
import Settings from './settings/Settings';
import Timer from './timer/Timer';
import Titlebar from './titlebar/Titlebar';
import './pomodoro.sass';

export default function Pomodoro() {

    const { misc } = useData();

    return (
        <main class="pomodoro">
            <header>
                <Titlebar />
            </header>

            <section>
                <Timer />
            </section>

            <footer>
                <Popup />
                <Controls />
            </footer>


            <aside class={misc.status.settings}>
                <Settings />
            </aside>
        </main>
    );
}