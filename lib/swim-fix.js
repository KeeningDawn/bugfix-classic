// Fixes a bug where staying still in the water will spam duplicate location packets, causing the server to disconnect the player
// Written by: Pinkie Pie, Improved by: Dawn

module.exports = function SwimFix(mod) {
	let lastCPL = null;

	mod.hook('C_PLAYER_LOCATION', 5, { order: -90 }, (event) => {
		const { w, lookDirection, loc, dest, jumpDistance, inShuttle, type } = event;
		// Store values as a float rather than a vec3 to improve memory footprint.
		const lx = loc.x,
			ly = loc.y,
			lz = loc.z;
		const dx = dest.x,
			dy = dest.y,
			dz = dest.z;

		if (
			lastCPL &&
			lastCPL.w === w &&
			lastCPL.lookDirection === lookDirection &&
			lastCPL.jumpDistance === jumpDistance &&
			lastCPL.inShuttle === inShuttle &&
			lastCPL.type === type &&
			// Direct comparions (as opposed to .equals()) are faster computationally.
			lastCPL.lx === lx &&
			lastCPL.ly === ly &&
			lastCPL.lz === lz &&
			lastCPL.dx === dx &&
			lastCPL.dy === dy &&
			lastCPL.dz === dz
		)
			return false;

		lastCPL = {
			w,
			lookDirection,
			jumpDistance,
			inShuttle,
			type,
			lx,
			ly,
			lz,
			dx,
			dy,
			dz,
		};
	});
};
