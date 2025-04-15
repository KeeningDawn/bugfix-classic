// Removes potentially malicious injected HTML content from other users' chat messages
// Written by: Pinkie Pie, Improved by: Dawn

module.exports = function ChatSanitizer(mod) {
  // Precompile tags and patterns so sanitize() is more readable.
  const allowedTags = new Set(['FONT', '/FONT', '/ChatLinkAction']);
  const fontTagRegex = /^font(?: face="\$chatfont" size="18" )?color="#[0-9a-f]{1,6}"(?: kerning="0")?$/i;
  const chatLinkRegex = /^ChatLinkAction param=".+?"$/;

  mod.hook('S_CHAT', 2, { order: 10 }, sanitize);
  mod.hook('S_WHISPER', 2, { order: 10 }, sanitize);
  mod.hook('S_PRIVATE_CHAT', 1, { order: 10 }, sanitize);

  function sanitize(event) {
    const original = event.message;

    event.message = original.replace(/<(.+?)>/g, (match, tag) => {
      if (allowedTags.has(tag)) return match;
      if (fontTagRegex.test(tag)) return match;
      if (chatLinkRegex.test(tag)) return match;
      return '';
    });

    return event.message !== original || undefined;
  }
};
