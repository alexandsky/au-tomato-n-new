import { useData } from '../../data';
import './timer.sass';

export default function Timer() {

    const { state, time } = useData();

    function isZeroHidden(value: number) {
        return value > 9;
    }

    return (
        <div class="timer">
            <div class="info">
                <div class="info__state">
                    cycle #{state.cycle}&nbsp;&mdash; {state.phase}
                </div>
                <div class="info__prompt">
                    time left
                </div>
            </div>
            <div class="time">
                <div class="time__hours">
                    <span classList={{ hidden: isZeroHidden(time.hours) }}>0</span>
                    {time.hours}
                </div>
                :
                <div class="time__minutes">
                    <span classList={{ hidden: isZeroHidden(time.minutes) }}>0</span>
                    {time.minutes}
                </div>
                :
                <div class="time__seconds">
                    <span classList={{ hidden: isZeroHidden(time.seconds) }}>0</span>
                    {time.seconds}
                </div>
            </div>
        </div>
    );
}