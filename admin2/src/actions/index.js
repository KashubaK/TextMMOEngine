export const addTiles = tiles => {
    return {
        type: "ADD_TILES",
        payload: tiles
    }
}

export const addWorldTiles = world_tiles => ({
    type: 'ADD_WORLDTILES',
    payload: world_tiles
})

export const addWorldTile = world_tile => ({
    type: 'ADD_WORLDTILE',
    payload: world_tile
})

export const selectTile = tile => ({
    type: 'SELECT_TILE',
    payload: tile
})