import { useData } from '../../data';
import gear from '../../assets/icons/gear.svg';
import './titlebar.sass';

export default function Titlebar() {

    const { misc } = useData();

    function handleOpen() {
        misc.status.settings = 'visible';
    }

    return (
        <div class="titlebar">
            <div class="title">
                <p class="title__main">au-tomato-n</p>
                <p class="title__sub">a pomodoro timer</p>
            </div>

            <button onClick={handleOpen}>
                <img src={gear} />
            </button>
        </div>
    );
}