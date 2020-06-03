export const SET_DIRECTORIES = "SELECT_DIRECTORIES";
export const SET_SNAPSHOTS = "SET_SNAPSHOTS";
export const SET_PROCESSING_STATUS = "SET_PROCESSING_STATUS";
export const SET_ANALYSIS = "SET_ANALYSIS";
export const SET_SETTINGS = "SET_SETTINGS"


const {myIpcRenderer} = window;

export function selectDirectories() {
    return async dispatch => {
        try {
            const dirs = await myIpcRenderer.invoke('APP_SELECT_DIRECTORIES');
            dispatch(setDirectories(dirs ? dirs : null));
        } catch (e) {
            console.error(e);
            dispatch(setDirectories(null));
        }
    };
}

export function selectSnapshots() {
    return async dispatch => {
        try {
            const snapshots = await myIpcRenderer.invoke('APP_SELECT_SNAPSHOTS');
            dispatch(setSnapshots(snapshots ? snapshots : null));
        } catch (e) {
            console.error(e);
            dispatch(setSnapshots(null));
        }
    };
}

export function setAnalysis(analysis) {
    return {
        type: SET_ANALYSIS,
        payload: analysis
    }
}

export function setSettings(setting) {
    return {
        type: SET_SETTINGS,
        payload: setting
    }
}

export function setDirectories(dirs) {
    return {
        type: SET_DIRECTORIES,
        payload: dirs
    }
}

export function setSnapshots(snapshots) {
    return {
        type: SET_SNAPSHOTS,
        payload: snapshots
    }
}

export function setProcessingStatus(status) {
    return {
        type: SET_PROCESSING_STATUS,
        payload: status
    }
}
