import linksmith from './index';

const mainUrl = 'https://example.com';
const mainUrlWithoutProtocol = 'example.com';
const mainIP = 'http://192.168.0.1';
const mainIPv6Bracketed = 'http://[2001:db8::1]:8080';
const mainIPv6Plain = '[2001:db8::1]';
const loopbackIPv6 = 'http://[::1]';
const port = 3000;
const subdomains = ['api', 'v1'];
const paths = ['users', '123'];
const queryParams = { filter: 'active', sort: 'name', page: 1, limit: 10, async: true };

describe('linksmith', () => {
  it('should construct URL with subdomains, paths, and query parameters', () => {
    const url = linksmith(mainUrl, {
      port: port,
      subDomains: subdomains,
      paths: paths,
      queryParams: queryParams,
    });
    expect(url).toBe(
      'https://api.v1.example.com:3000/users/123?filter=active&sort=name&page=1&limit=10&async=true',
    );
  });

  it('should throw an error if main URL is empty', () => {
    expect(() => linksmith('', {})).toThrow('Main URL is empty');
  });

  it('should handle URL without options', () => {
    const url = linksmith(mainUrl);
    expect(url).toBe(mainUrl);
  });

  it('should handle URL without protocol', () => {
    const url = linksmith(mainUrlWithoutProtocol);
    expect(url).toBe(mainUrlWithoutProtocol);
  });

  it('should handle URL with port only', () => {
    const url = linksmith(mainUrl, { port: port });
    expect(url).toBe('https://example.com:3000/');
  });

  it('should handle URL with subdomains only', () => {
    const url = linksmith(mainUrl, { subDomains: subdomains });
    expect(url).toBe('https://api.v1.example.com/');
  });

  it('should handle URL with paths only', () => {
    const url = linksmith(mainUrl, { paths: paths });
    expect(url).toBe('https://example.com/users/123');
  });

  it('should handle URL with query parameters only', () => {
    const url = linksmith(mainUrl, { queryParams: queryParams });
    expect(url).toBe('https://example.com/?filter=active&sort=name&page=1&limit=10&async=true');
  });

  it('should throw an error if subdomain is added to an IP address', () => {
    expect(() => linksmith(mainIP, { subDomains: subdomains })).toThrow(
      "You can't add subdomain to an ip address",
    );
  });

  it('should handle URL with www prefix', () => {
    const url = linksmith('https://www.example.com', { subDomains: subdomains });
    expect(url).toBe('https://www.api.v1.example.com/');
  });

  it('should handle URL with IPv4 address', () => {
    const url = linksmith(mainIP, { port: port });
    expect(url).toBe('http://192.168.0.1:3000/');
  });

  // IPv6 tests
  it('should throw an error if subdomain is added to a plain IPv6 address', () => {
    expect(() => linksmith(mainIPv6Plain, { subDomains: subdomains })).toThrow(
      "You can't add subdomain to an ip address",
    );
  });

  it('should handle IPv6 bracketed address with port', () => {
    const url = linksmith(mainIPv6Bracketed, { port: port });
    expect(url).toBe('http://[2001:db8::1]:3000/');
  });

  it('should handle loopback ipv6 ::1', () => {
    const url = linksmith(loopbackIPv6, { port: 8080 });
    expect(url).toBe('http://[::1]:8080/');
  });
});
