import { createSignal } from 'solid-js';
import './settings-hint.sass'

type SettingsHintProps = {
    text: string;
}

export function SettingsHint(props: SettingsHintProps) {

    const [textVisible, setTextVisible] = createSignal(false);

    const showText = () => {
        setTextVisible(true);
    };
    const hideText = () => {
        setTextVisible(false);
    }

    return (
        <div class="settings-hint">
            <div
                class="hint-icon non-selectable"
                onMouseEnter={showText}
                onMouseLeave={hideText}
                onTouchStart={showText}
                onTouchEnd={hideText}
            >
                ?
            </div>
            <div
                class="hint-text"
                classList={{
                    visible: textVisible()
                }}
            >
                {props.text}
            </div>
        </div>
    );
}