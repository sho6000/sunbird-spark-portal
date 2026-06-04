import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Allows all safe HTML tags by default, but blocks dangerous elements like scripts
 * @param html - Raw HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';

  // Bind DOMPurify to the *current* window on every call instead of relying on the
  // window captured when the module was first imported. In test environments
  // (happy-dom) the window can be torn down between tests, leaving the import-time
  // instance pointed at a destroyed document — which makes sanitize() silently strip
  // all tags. Rebinding guarantees a live document; in the browser this is the same
  // stable window. DOMPurify's default configuration allows most HTML tags but
  // automatically removes dangerous elements like <script>, <iframe>, event handlers, etc.
  const purifier = typeof window !== 'undefined' ? DOMPurify(window) : DOMPurify;

  return purifier.sanitize(html);
};
