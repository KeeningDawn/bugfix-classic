// Removes potentially malicious injected HTML content from other users' chat messages
// Written by: Pinkie Pie, Improved by: Dawn

module.exports = function ChatSanitizer(mod) {
	mod.hook('S_CHAT', 2, { order: 10 }, sanitize);
	mod.hook('S_WHISPER', 2, { order: 10 }, sanitize);
	mod.hook('S_PRIVATE_CHAT', 1, { order: 10 }, sanitize);
};

const fontStyleRegex = /^font (face="\$chatfont" size="18" )?color="#[0-9a-f]{1,6}"( kerning="0")?$/i;
const chatLinkRegex = /^A HREF="asfunction:chatLinkAction,[^"]*"$/i;

function sanitize(event) {
	let msg = event.message;
	let changed = false;

	msg = msg.replace(/<(.+?)>/g, (match, tag) => {
		if (tag === 'FONT' || tag === '/FONT' || tag === '/A' || fontStyleRegex.test(tag) || chatLinkRegex.test(tag)) {
			return match;
		}
		changed = true;
		return '';
	});

	return changed ? (event.message = msg) : undefined;
}
