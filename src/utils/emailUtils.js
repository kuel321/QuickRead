export function parseFromHeader(fromHeader) {
    if (!fromHeader || typeof fromHeader !== 'string') {
      return { name: '', email: '' };
    }
  
    const match = fromHeader.match(/^"?([^"<@]+?)"?\s*<([^>]+)>$/);
  
    if (match) {
      return {
        name: match[1].trim(),
        email: match[2].trim(),
      };
    }
  
    // Fallbacks
    if (fromHeader.includes('@')) {
      return { name: '', email: fromHeader.trim() };
    } else {
      return { name: fromHeader.trim(), email: '' };
    }
  }
  export function cleanText(text) {
    if (!text) return '';
  
    // Basic cleanup
    text = text
      .replace(/%opentrack%/gi, '')
      .replace(/https?:\/\/\S+/gi, '')
      .replace(/(unsubscribe|view in browser|privacy policy|update preferences|sent from my|do not reply|stop receiving|show more).*/gi, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/-+/g, '')
      .split('\n--')[0];
  
    // Normalize and split into lines
    const lines = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  
    // Remove duplicates (preferring lowercase version)
    const seen = new Set();
    const unique = [];
  
    for (const line of lines) {
      const normalized = line.toLowerCase();
      if (!seen.has(normalized)) {
        seen.add(normalized);
        unique.push(line); // keep original line (first lowercase will be used if it comes first)
      }
    }
  
    return unique.join('\n\n').trim();
  }
  
  