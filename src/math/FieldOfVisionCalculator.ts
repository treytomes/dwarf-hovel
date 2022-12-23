import MoreMath from "../framework/MoreMath";
import Rectangle from "./Rectangle";
import Point from "./Point";
import Shadow from "./Shadow";
import { max, min } from "lodash";

/**
 * Calculates the hero's field of view of the dungeon.
 * 
 * Learned of this algorithm here: http://journal.stuffwithstuff.com/2015/09/07/what-the-hero-sees/
 */
export default class FieldOfVisionCalculator {
	width: number;
	height: number;
	_visibility: boolean[][];
	_shadows: Shadow[];

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
		this._shadows = [];
		this.clear();
	}

	isVisible(x: number, y: number): boolean {
		if (MoreMath.isInRange(x, 0, this.width) && MoreMath.isInRange(y, 0, this.height)) {
			return this._visibility[y][x];
		} else {
			return false;
		}
	}

	clear() {
		this._visibility = new Array(this.height).fill(null).map(() => new Array(this.width).fill(null));
	}

	/**
	 * Updates the visible flags given the hero's position.
	 */
	refresh(x: number, y: number, range: number, mapBlocksVision: (x: number, y: number) => boolean) {
		this.clear();

		let minX = x - range;
		let maxX = x + range;
		let minY = y - range;
		let maxY = y + range;
		if (minX < 0) {
			minX = 0;
		}
		if (maxX >= this.width) {
			maxX = this.width - 1;
		}
		if (minY < 0) {
			minY = 0;
		}
		if (maxY >= this.height) {
			maxY = this.height - 1;
		}

		// TODO: !=0 will see if it's in the blocking layer.  What if it's a door?  Or a window?
		let start = new Point(x, y);

		//if (!mapBlocksVision(startX, startY)) {
		// Sweep through the octants.
		for (let octant = 0; octant < 8; octant++) {
			this.refreshOctant(mapBlocksVision, minX, maxX, minY, maxY, start, octant);
		}

		// Mark the starting position as visible.
		this._visibility[start.y][start.x] = true;
		//}
	}

	private refreshOctant(mapBlocksVision: (x: number, y: number) => boolean, minX: number, maxX: number, minY: number, maxY: number, start: Point, octant: number): number {
		let numExplored = 0;
		let rowInc = Point.zero;
		let colInc = Point.zero;

		// Figure out which direction to increment based on the octant. Octant 0
		// starts at 12 - 2 o'clock, and octants proceed clockwise from there.
		switch (octant) {
			case 0:
				rowInc = Point.unitY.negate;
				colInc = Point.unitX;
				break;
			case 1:
				rowInc = Point.unitX;
				colInc = Point.unitY.negate;
				break;
			case 2:
				rowInc = Point.unitX;
				colInc = Point.unitY;
				break;
			case 3:
				rowInc = Point.unitY;
				colInc = Point.unitX;
				break;
			case 4:
				rowInc = Point.unitY;
				colInc = Point.unitX.negate;
				break;
			case 5:
				rowInc = Point.unitX.negate;
				colInc = Point.unitY;
				break;
			case 6:
				rowInc = Point.unitX.negate;
				colInc = Point.unitY.negate;
				break;
			case 7:
				rowInc = Point.unitY.negate;
				colInc = Point.unitX.negate;
				break;
		}

		this._shadows = [];

		let bounds = new Rectangle(minX, minY, maxX - minX + 1, maxY - minY + 1);
		let fullShadow = false;

		// Sweep through the rows ('rows' may be vertical or horizontal based on the incrementors). Start at row 1 to skip the center position.
		for (let row = 1; ; row++) {
			let pos = start.add(rowInc.multiply(row));

			// If we've traversed out of bounds, bail.
			// Note: this improves performance, but works on the assumption that the starting tile of the FOV is in bounds.
			if (!bounds.contains(pos.x, pos.y)) {
				break;
			}

			for (let col = 0; col <= row; col++) {
				let blocksLight = false;
				let visible = false;
				let projection: Shadow = null;

				// If we know the entire row is in shadow, we don't need to be more specific.
				if (!fullShadow) {
					blocksLight = mapBlocksVision(pos.x, pos.y);
					projection = this.getProjection(row, col);
					visible = !this.isInShadow(projection);
				}

				// Set the visibility of this tile.
				if (this._visibility[pos.y][pos.x] != visible) {
					this._visibility[pos.y][pos.x] = visible;
					if (visible) {
						numExplored++;
					}
				}

				// Add any opaque tiles to the shadow map.
				if (blocksLight) {
					fullShadow = this.addShadow(projection);
				}

				// Move to the next column.
				pos = pos.add(colInc);

				// If we've traversed out of bounds, bail on this row.
				// Note: this improves performance, but works on the assumption that the starting tile of the FOV is in bounds.
				if (!bounds.contains(pos.x, pos.y)) {
					break;
				}
			}
		}

		return numExplored;
	}

	/**
	 * Creates a [Shadow] that corresponds to the projected silhouette of the
	 * given tile. This is used both to determine visibility (if any of the
	 * projection is visible, the tile is) and to add the tile to the shadow map.
	 * 
	 * The maximal projection of a square is always from the two opposing
	 * corners. From the perspective of octant zero, we know the square is
	 * above and to the right of the viewpoint, so it will be the top left and
	 * bottom right corners.
	 */
	private getProjection(row: number, col: number): Shadow {
		// The top edge of row 0 is 2 wide.
		var topLeft = col / (row + 2);

		// The bottom edge of row 0 is 1 wide.
		var bottomRight = (col + 1) / (row + 1);

		return new Shadow(topLeft, bottomRight);
	}

	private isInShadow(projection: Shadow): boolean {
		// Check the shadow list.
		for (let n = 0; n < this._shadows.length; n++) {
			if (this._shadows[n].contains(projection)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Add [shadow] to the list of non-overlapping shadows.  May merge one or more shadows.
	 */
	private addShadow(shadow: Shadow): boolean {
		// Figure out where to slot the new shadow in the sorted list.
		let index = 0;
		for (index = 0; index < this._shadows.length; index++) {
			// Stop when we hit the insertion point.
			if (this._shadows[index].start >= shadow.start) {
				break;
			}
		}

		// The new shadow is going here. See if it overlaps the previous or next.
		var overlapsPrev = ((index > 0) && (this._shadows[index - 1].end > shadow.start));
		var overlapsNext = ((index < this._shadows.length) && (this._shadows[index].start < shadow.end));

		// Insert and unify with overlapping shadows.
		if (overlapsNext) {
			if (overlapsPrev) {
				// Overlaps both, so unify one and delete the other.
				this._shadows[index - 1].end = max([ this._shadows[index - 1].end, this._shadows[index].end ]);
				this._shadows.splice(index, 1);
			}
			else {
				// Just overlaps the next shadow, so unify it with that.
				this._shadows[index].start = min([ this._shadows[index].start, shadow.start ]);
			}
		}
		else {
			if (overlapsPrev) {
				// Just overlaps the previous shadow, so unify it with that.
				this._shadows[index - 1].end = max([ this._shadows[index - 1].end, shadow.end ]);
			}
			else {
				// Does not overlap anything, so insert.
				this._shadows.splice(index, 0, shadow);
			}
		}

		// See if we are now shadowing everything.
		return (this._shadows.length == 1) && (this._shadows[0].start == 0) && (this._shadows[0].end == 1);
	}
}
