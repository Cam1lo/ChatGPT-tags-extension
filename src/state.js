class ActiveFilterState {
    constructor() {
        if (!ActiveFilterState.instance) {
            this.activeFilter = null;
            ActiveFilterState.instance = this;
        }

        return ActiveFilterState.instance;
    }

    setActiveFilter(filter) {
        this.activeFilter = filter;
    }

    getActiveFilter() {
        return this.activeFilter;
    }

    clearActiveFilter() {
        this.activeFilter = null;
    }
}

const state = new ActiveFilterState();

export default state;
