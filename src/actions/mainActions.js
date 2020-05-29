export const SET_DIRECTORIES = "SELECT_DIRECTORIES";
export const SET_SNAPSHOTS = "SET_SNAPSHOTS";
export const SET_PROCESSING_STATUS = "SET_PROCESSING_STATUS";
export const SET_ANALISIS = "SET_ANALISIS";

const { myIpcRenderer } = window;

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
};

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
};

export function setAnalisis(analysis) {
  return {
      type: SET_ANALISIS,
      payload: analysis
  }
}

export function setDirectories(dirs) {
    return {
        type: SET_DIRECTORIES,
        payload: dirs
    }
};

export function setSnapshots(snapshots) {
    return {
        type: SET_SNAPSHOTS,
        payload: snapshots
    }
};

export function setProcessingStatus(status) {
    return {
        type: SET_PROCESSING_STATUS,
        payload: status
    }
};
