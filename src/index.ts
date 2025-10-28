import { isIP as nodeIsIP } from 'net';

/**
 * Constructs a URL by appending subdomains, paths, and query parameters to a given base URL.
 *
 * @param mainUrl - The base URL to which subdomains, paths, and query parameters will be added.
 * @param options - Optional object containing:
 *  - port - An string or number to be added to mainUrl.
 *  - subDomains - An array of subdomains to be added before the mainUrl.
 *  - paths - An array of path components to be appended to end of the mainUrl.
 *  - queryParams - An object representing query parameters to be appended to the URL.
 *
 * @returns The constructed URL as a string, including subdomains, paths, and query parameters.
 *
 * @example
 * const url = linksmith("https://example.com", {
 *     port: 3000,
 *     subDomains: ["api", "v1"],
 *     paths: ["users", "123"],
 *     queryParams: { filter: "active", sort: "name" }
 * });
 * console.log(url);
 * // Output: "https://api.v1.example.com:3000/users/123?filter=active&sort=name"
 */
export default function linksmith(
  mainUrl: string,
  options?: {
    port?: string | number;
    subDomains?: string[];
    paths?: string[];
    queryParams?: { [key: string]: string | number | boolean };
  },
): string {
  // Ensure the base URL is not empty.
  if (mainUrl == '') throw new Error('Main URL is empty');

  // If no options are provided, return the base URL as is.
  if (!options) return mainUrl;

  // If the input is a bare bracketed IPv6 like "[2001:db8::1]" (no protocol)
  // ensure we reject adding subdomains immediately.
  if (mainUrl.trim().startsWith('[') && mainUrl.includes(']') && options.subDomains != undefined) {
    throw new Error("You can't add subdomain to an ip address");
  }

  // If the raw input contains a bracketed IPv6 literal anywhere, treat it
  // as an IP for the purpose of rejecting subdomains (covers inputs like
  // "http://[2001:db8::1]", and "[2001:db8::1]:8080").
  if (/\[[0-9A-Fa-f:.]+\]/.test(mainUrl) && options.subDomains != undefined) {
    throw new Error("You can't add subdomain to an ip address");
  }

  // Extract a host-like candidate from the raw input (works with:
  // - host:port: "example.com:3000" or "192.168.0.1:80"
  // - plain host with path: "example.com/path"
  // We then detect whether that host is an IP; if so and subDomains are
  // provided, we must throw.
  const afterProto = mainUrl.includes('://') ? mainUrl.split('://')[1] : mainUrl;
  const candidate = (() => {
    const m = afterProto.match(/^(\[[^\]]+\]|[^/:]+)(?::\d+)?/);
    return m ? m[1] : afterProto;
  })();

  if (isIP(candidate) && options.subDomains != undefined) {
    throw new Error("You can't add subdomain to an ip address");
  }

  // We'll parse the URL using the URL API. If the input lacks a protocol
  // we'll prepend a dummy one for parsing (we'll return the full URL when
  // options are provided).
  const hadProtocol = mainUrl.includes('://');
  const parseable = hadProtocol ? mainUrl : `http://${mainUrl}`;
  const url = new URL(parseable);

  const hostname = url.hostname; // hostname never contains brackets
  const isIpUrl = isIP(hostname);

  if (isIpUrl && options.subDomains != undefined) {
    throw new Error("You can't add subdomain to an ip address");
  }

  // Handle www prefix. If hostname starts with www., keep it and add new
  // subdomains after www. (matches existing behavior / tests).
  let hasWww = false;
  let baseHost = hostname;
  if (hostname.startsWith('www.')) {
    hasWww = true;
    baseHost = hostname.replace(/^www\./, '');
  }

  // Apply subdomains (if not an IP)
  if (options.subDomains != undefined) {
    const sub = options.subDomains.join('.') + '.';
    const newHost = hasWww ? `www.${sub}${baseHost}` : `${sub}${baseHost}`;
    url.hostname = newHost; // URL will handle IPv6 bracket logic
  }

  // Handle port: if options.port provided override existing
  if (options.port != undefined) {
    url.port = String(options.port);
  }

  // Handle paths: append to existing pathname
  if (options.paths != undefined) {
    const path = options.paths.join('/');
    const currentPath = url.pathname === '/' ? '' : url.pathname.replace(/\/+$/, '');
    url.pathname = `/${[currentPath, path].filter(Boolean).join('/')}`;
  }

  // Handle query parameters
  if (options.queryParams != undefined) {
    Object.entries(options.queryParams).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(key, String(v)));
      } else {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // Return the constructed URL. If the original input had no protocol we
  // used http:// for parsing — returning the full URL string is acceptable
  // when options are provided (previous behavior would have thrown).
  return url.toString();
}

function isIP(data: string): boolean {
  // Normalize by stripping bracket notation
  const stripped = data.replace(/^\[|\]$/g, '');

  // If it contains ':' it's probably IPv6 (or something with a colon). For
  // plain IPv6 addresses we should test the whole value — don't try to
  // heuristically strip a trailing numeric segment as a port (that breaks
  // valid IPv6 like 2001:db8::1).
  if (stripped.includes(':')) {
    return nodeIsIP(stripped) !== 0;
  }

  // Otherwise treat as hostname or IPv4 with optional port; strip any :port
  const hostWithoutPort = stripped.split(':')[0];
  return nodeIsIP(hostWithoutPort) !== 0;
}
