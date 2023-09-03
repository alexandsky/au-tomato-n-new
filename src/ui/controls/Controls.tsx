import { ParentProps } from 'solid-js';
import { useData } from '../../data';
import './controls.sass';

export default function Controls() {

    const { start, stop, pause, resume, misc } = useData();

    return (
        <div class="controls">
            <ControlsGroup
                hidden={misc.status.timer !== 'stopped'}
            >
                <ControlsButton
                    onClick={start}
                    text={'start'}
                />
            </ControlsGroup>
            <ControlsGroup
                hidden={misc.status.timer !== 'started'}
            >
                <ControlsButton
                    onClick={stop}
                    text={'stop'}
                />
                <ControlsButton
                    onClick={pause}
                    text={'pause'}
                />
            </ControlsGroup>
            <ControlsGroup
                hidden={misc.status.timer !== 'paused'}
            >
                <ControlsButton
                    onClick={stop}
                    text={'stop'}
                />
                <ControlsButton
                    onClick={resume}
                    text={'resume'}
                />
            </ControlsGroup>
        </div>
    );
}

type ControlsGroupProps = ParentProps & {
    hidden: boolean
}

function ControlsGroup(props: ControlsGroupProps) {
    return (
        <div
            class="controls-group"
            classList={{
                hidden: props.hidden
            }}
        >
            {props.children}
        </div>
    )
}

type ControlsButtonProps = {
    onClick: () => void,
    text: string
}

function ControlsButton(props: ControlsButtonProps) {
    return (
        <button
            class="controls-group__button"
            onClick={props.onClick}
        >
            {props.text}
        </button>
    )
}