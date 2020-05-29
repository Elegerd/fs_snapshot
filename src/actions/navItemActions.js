export const SELECT_NAV_ID = "SELECT_NAV_ID";

export function selectNavId(id) {
    return {
        type: SELECT_NAV_ID,
        payload: id
    }
};
