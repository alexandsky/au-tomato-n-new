import { JSX } from 'solid-js';
import './settings-item.sass';

const DEFAULT_MIN = 1;
const DEFAULT_MAX = 1440;

type SettingsItemProps = {
    onChange: (value: number) => void;
    value: number;
    label: string;
    min?: number;
    max?: number;
}

function SettingsItem(props: SettingsItemProps) {

    const min = props.min || DEFAULT_MIN;
    const max = props.max || DEFAULT_MAX;

    const handleChange: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = (e) => {
        props.onChange(+e.target.value);
    }

    const handleBlur: JSX.FocusEventHandlerUnion<HTMLInputElement, FocusEvent> = (e) => {
        if (+e.target.value < min) {
            props.onChange(min);
        }
        if (+e.target.value > max) {
            props.onChange(max);
        }
    }

    return (
        <div class="settings-item">
            <label>{props.label || 'item'}</label>
            <input
                type='number'
                min={min}
                max={max}
                onChange={handleChange}
                onBlur={handleBlur}
                value={props.value}
            />
        </div>
    );
}

export default SettingsItem;