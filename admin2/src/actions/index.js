export const addTiles = tiles => ({
    type: "ADD_TILES",
    payload: tiles
})

export const addWorldTiles = world_tiles => ({
    type: 'ADD_WORLDTILES',
    payload: world_tiles
})

export const addWorldTile = world_tile => ({
    type: 'ADD_WORLDTILE',
    payload: world_tile
})

export const selectWorldTile = world_tile => ({
    type: 'SELECT_WORLDTILE',
    payload: world_tile
})

export const updateWorldTile = world_tile => ({
    type: 'UPDATE_WORLDTILE',
    payload: world_tile
})

export const deleteWorldTile = world_tile_id => ({
    type: 'DELETE_WORLDTILE',
    payload: world_tile_id
})

export const selectTile = tile => ({
    type: 'SELECT_TILE',
    payload: tile
})

export const deleteTile = tile => ({
    type: 'DELETE_TILE',
    payload: tile
})

export const updateTile = tile => ({
    type: 'UPDATE_TILE',
    payload: tile
})

export const selectTool = tool => ({
    type: 'SELECT_TOOL',
    payload: tool
})

export const setMousePosition = coords => ({
    type: 'SET_MOUSE_POSITION',
    payload: coords
})

export const setInitialMouseTarget = coords => ({
    type: 'SET_INITIAL_MOUSE_TARGET',
    payload: coords
})

export const setFinalMouseTarget = coords => ({
    type: 'SET_FINAL_MOUSE_TARGET',
    payload: coords
})

export const setListeningForFinalTarget = listening => ({
    type: 'SET_LISTENING_FOR_FINAL_TARGET',
    payload: listening
})