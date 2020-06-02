import {
    SET_DIRECTORIES,
    SET_PROCESSING_STATUS,
    SET_SNAPSHOTS,
    SET_ANALYSIS,
    SET_SETTING
} from '../actions/mainActions.js'


const initState = {
    selectedDirectories: null,
    selectedSnapshots: null,
    processingStatus: null,
    analysis: null,
    setting: {
        disabledSchedule: false,
        hour: 15,
        time: 0
    }
}

export function mainReducer(state = initState, action) {
    switch (action.type) {
        case SET_DIRECTORIES: {
            return {
                ...state,
                selectedDirectories: action.payload
            }
        }
        case SET_ANALYSIS: {
            return {
                ...state,
                analysis: action.payload
            }
        }
        case SET_SETTING: {
            return {
                ...state,
                setting: action.payload
            }
        }
        case SET_SNAPSHOTS: {
            return {
                ...state,
                selectedSnapshots: action.payload ?
                    action.payload.slice(0, 2) : action.payload
            }
        }
        case SET_PROCESSING_STATUS: {
            return {
                ...state,
                processingStatus: action.payload ? {
                    ...state.processingStatus,
                    ...action.payload
                } : action.payload
            }
        }
        default:
            return state;
    }
}
