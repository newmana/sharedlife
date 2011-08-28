/**
 * John Conway's Game of Life
 *
 * SPACE
 *    pause / unpause
 * LEFT/RIGHT
 *    next step, if paused
 * MOUSE CLICK or MOUSE DRAG
 *    activate cell
 *
 */

function addClickHandler(elementId, fn) {
   document.getElementById(elementId).addEventListener('click', fn, false);
};
// disable normal browser mouse select
function disableMouseSelect() {
   // no text select on drag
   document.body.style.webkitUserSelect = 'none';
   // non right clickery
   document.body.oncontextmenu = function() { return false; };
}

function main() {
  gbox.setGroups(['game']);
  maingame = gamecycle.createMaingame('game', 'game');

  // We'll add more here in the next step...

  gbox.go();
}
