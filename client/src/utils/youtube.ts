export interface HomeVideoCardCopy {
  heading: string;
  accent: string;
  body: string;
}

const YOUTUBE_ID = '[A-Za-z0-9_-]{11}';

/**
 * Turn a YouTube watch, share, shorts, or embed link into an embed URL.
 * Leaves non-YouTube URLs unchanged so Vimeo and other players still work.
 */
export function toYouTubeEmbedUrl(input: string): string {
  const trimmed = (input || '').trim();
  if (!trimmed) return '';

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, '');
    let id = '';

    if (host === 'youtu.be') {
      id = parsed.pathname.split('/').filter(Boolean)[0] || '';
    } else if (
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'music.youtube.com' ||
      host === 'youtube-nocookie.com'
    ) {
      if (parsed.pathname === '/watch') {
        id = parsed.searchParams.get('v') || '';
      } else {
        const parts = parsed.pathname.split('/').filter(Boolean);
        const kind = parts[0];
        if (kind === 'embed' || kind === 'shorts' || kind === 'live' || kind === 'v') {
          id = parts[1] || '';
        }
      }
    }

    if (new RegExp(`^${YOUTUBE_ID}$`).test(id)) {
      return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    // Not an absolute URL; fall through to pattern matching.
  }

  const match = trimmed.match(new RegExp(`(?:embed/|youtu\\.be/|v=)(${YOUTUBE_ID})`));
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }

  return trimmed;
}

/**
 * The homepage card is three parts: a heading, a green highlight, and a paragraph.
 * Editors store that in the CMS description as separate lines:
 *   Celebrating
 *   24 years of Excellence
 *   Refex's journey...
 * A two-line title is used the same way when the description is only the paragraph.
 */
export function parseHomeVideoCard(title: string, description: string): HomeVideoCardCopy {
  const lines = (description || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const short = (line: string) => line.length > 0 && line.length <= 80;

  if (lines.length >= 3 && short(lines[0]) && short(lines[1])) {
    return {
      heading: lines[0],
      accent: lines[1],
      body: lines.slice(2).join(' '),
    };
  }

  if (lines.length === 2 && short(lines[0]) && short(lines[1])) {
    return { heading: lines[0], accent: lines[1], body: '' };
  }

  const titleLines = (title || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (titleLines.length >= 2) {
    return {
      heading: titleLines[0],
      accent: titleLines.slice(1).join(' '),
      body: lines.join('\n\n') || (description || '').trim(),
    };
  }

  return {
    heading: (title || '').trim(),
    accent: '',
    body: lines.join('\n\n') || (description || '').trim(),
  };
}
