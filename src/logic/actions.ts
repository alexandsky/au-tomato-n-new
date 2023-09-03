const MAX_ACTIONS = 1_000_000;

type Action = () => void;

export class Actions {
    private actions = new Map<number, Action>;
    private id = 0;

    add(action: Action) {
        if (this.actions.size >= MAX_ACTIONS) {
            console.error('Maximum amount of actions has been reached! Following action cannot be added:', action);
            return -1;
        }
        if (this.id >= Number.MAX_SAFE_INTEGER) {
            console.error('ID limit (MAX_SAFE_INTEGER) reached, actions cannot be added to this instance anymore.');
            return -1;
        }
        this.actions.set(this.id, action);
        return this.id++;
    }

    set(action: Action, id: number) {
        if (!this.actions.has(id)) {
            console.error(`Action with ID ${id} does not exist!`);
        }
        this.actions.set(id, action);
    }

    remove(id: number) {
        return this.actions.delete(id);
    }

    trigger(id: number) {
        try {
            this.actions.get(id)?.();
        }
        catch (err) {
            console.error(err);
        }
    }

    triggerAll() {
        this.actions.forEach((action) => {
            try {
                action();
            }
            catch (err) {
                console.error(err);
            }
        });
    }
}