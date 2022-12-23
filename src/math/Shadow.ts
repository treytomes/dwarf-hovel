/**
 * Represents the 1D projection of a 2D shadow onto a normalized line.  In other words, a range from 0.0 to 1.0.
 */
export default class Shadow {
	start: number;
	end: number;
	
	constructor(start: number, end: number) {
		this.start = start;
		this.end = end;
	}

	public toString = () : string => {
		return `({Start}-{End})`;
	}

	/// <summary>
	/// Returns `true` if [other] is completely covered by this shadow.
	/// </summary>
	contains(other: Shadow): boolean {
		return this.start <= other.start && this.end >= other.end;
	}
}