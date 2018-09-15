import { helper } from '@ember/component/helper';

export function tileStyle(params/*, hash*/) {
  const tile = params[0];
  const player = params[1];

  var style = "";

  if (!tile) return "border-color: transparent;";

  const playerIsOnTile = player.position === tile.position;

  switch (tile.material) {
    case "grass":
      style += "background-color: #7fb755;"
      break;
    case "earth":
      style += "background-color: #79563a;"
      break;
    case "wood":
      style += "background-color: #bb975d;"
      break;
    case "stone":
      style += "background-color: #ccc;"
      break;
  }

  if (playerIsOnTile) {
    style += "border-style: dashed; z-index: 0; box-shadow: 0 0 8px rgba(0, 0, 0, 1);"
  }

  return Ember.String.htmlSafe(style);
}

export default helper(tileStyle);
