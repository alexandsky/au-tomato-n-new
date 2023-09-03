import { useData } from '../../data';
import './popup.sass';

export default function Popup() {
    const { misc } = useData();
    return (
        <div class={`popup message ${misc.status.popup}`}>
            <div>{misc.message}</div>
        </div>
    );
}