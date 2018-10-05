export const ADD_TILE = (state, action) => {
    state.tiles = state.tiles.concat(action.payload);

    return state;
}