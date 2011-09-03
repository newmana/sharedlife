var gamejs;
var SurfaceArray;
var blitArray;

var DIRS = [
   [1,0],
   [0,1],
   [1,1],
   [-1,0],
   [0, -1],
   [-1,-1],
   [-1,1],
   [1,-1]
];
var DIRS_LENGTH = DIRS.length;

/*
 *
 *  For a space that is 'populated':
 *     Each cell with one or no neighbors dies, as if by loneliness.
 *     Each cell with two or three neighbors survives.
 *     Each cell with four or more neighbors dies, as if by overpopulation.
 *
 *  For a space that is 'empty' or 'unpopulated'
 *     Each cell with three neighbors becomes populated.
 */

exports.Map = function (dims) {
   var W = parseInt(dims[0], 10);
   var H = parseInt(dims[1], 10);
   this.width = W;
   this.height = H;
   this.map = [];

   this.setAt = function(x, y, alive) {
      if (x<0 || y<0) return;
      if (y>=W || x>=H) return;
      set(map, x, y, alive);
      return;
   }

   /**
    * set position to alive and update the neighbors
    * caches.
    */
   function set(cMap, x, y, alive) {
      if (cMap[x][y].alive === alive) {
         return;
      }

      cMap[x][y].alive = alive;
      cMap[x][y].modified = true;
      for (var i=0; i < DIRS_LENGTH; i++) {
         var dir = DIRS[i];
         var nx = x + dir[0];
         var ny = y + dir[1];
         if (nx < 0 || ny < 0) continue;
         if (nx >= H || ny >= W) continue;

         if (alive) {
            cMap[nx][ny].neighbors += 1;
         } else if (cMap[nx][ny].neighbors > 0) {
            cMap[nx][ny].neighbors -= 1;
         }
      }
      return;
   }

   /**
    * Update map according to game of life rules
    */
   this.update = function() {
      // copy
      var newMap = getMapClone();
      for (var i=0; i<H; i++) {
         for (var j=0; j<W; j++) {
            var neighbors = map[i][j].neighbors;
            var alive = map[i][j].alive;
            if (alive === true) {
               if (neighbors != 2 && neighbors != 3) {
                  set(newMap, i, j, false);
               }
            } else if (neighbors === 3) {
               set(newMap, i, j, true);
            }
         }
      }
      // update the internal state as well as the external.
      map = newMap;
      this.map = map;
      return;
   };
   
   this.clear = function() {
      initMap();
   };

   function initMap() {
      map = [];
      for (var i=0; i<H; i++) {
         map[i] = [];
         for (var j=0; j<W; j++) {
            map[i][j] = {
               alive: false,
               neighbors: 0,
               modified: true
            };
         }
      }
      return;
   };

   function getMapClone() {
      return map.map(function(r) {
         return r.map(function(i) {
            return {
               alive: i.alive,
               neighbors: i.neighbors
            };
         });
      });
   }
   
		this.getCellMap = function(width, height) {
			var packet = {};
			packet.width = width;
			packet.height = height;
			packet.cells = "";
      for (var y=0; y<height; y++) {
      	for (var x=0; x<width; x++) {
	      	if (map[y][x].alive) {
		      	packet.cells += "1";
        	} else {
		      	packet.cells += "0";
        	}
        }
  		}
      return packet;
		}

   this.random = function() {
      var c = ((W * H) / 5);
      for (var i=0;i<c;i++) {
         var x = parseInt(Math.random() * H, 10);
         var y = parseInt(Math.random() * W, 10);
         set(map, x, y, true);
      }

   };

   /**
    * Constructor randomly sets some cells alive.
    */
   initMap();
   this.random();
   return this;
};
