# linksmith

<p align="center">
  <img src="./link.png" alt="multipay logo" width="150" height="150" style="display: block; margin: 30 auto" />
</p>

![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.3.3-orange)

Linksmith is a flexible and powerful TypeScript-based URL builder for Node.js and frontend projects. Designed for developers who need to construct clean and efficient URLs, linksmith allows seamless addition of subdomains, paths, and query parameters with a simple, intuitive API. Linksmith handles edge cases like double slashes, missing query values, and dynamic subdomain additions, making it ideal for RESTful APIs, microservices, and other projects requiring dynamic URL generation. Linksmith is your all-in-one solution for URL construction in TypeScript.

- [linksmith](#linksmith)
  - [Key Features](#key-features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Input table](#input-table)
  - [Options table](#options-table)
  - [Example](#example)
  - [IPv4 and IPv6 examples](#ipv4-and-ipv6-examples)
  - [License](#license)

## Key Features

- **TypeScript Support**: Built with TypeScript, providing type safety and autocompletion.
- **Subdomain Management**: Easily add or modify subdomains in your URL.
- **Path Handling**: Concatenate paths with automatic slash normalization.
- **Query Parameters**: Effortlessly add query parameters.
- **Port Management**: Add port of your URL.

## Installation

```bash
npm i linksmith
```

## Usage

It's super easy! this function get `mainURL` and `options` and it returns URL as `string`.

## Input table

| Name    |  Type  | Explanation |
| :------ | :----: | ----------: |
| mainUrl | string |   *Required |
| options | object |    Optional |

## Options table

| Name        |       Type       |          Explanation |
| :---------- | :--------------: | -------------------: |
| port        | string or number |                    - |
| subDomains  |   string array   |   without any dot[.] |
| paths       |   string array   | without any slash[/] |
| queryParams |      object      |                    - |

## Example

```ts
import linksmith from 'linksmith'

...

const mainUrl = "https://example.com"
const options = {
    port: 3000,
    subDomains: ["api", "v1"],
    paths: ["users", "123"],
    queryParams: { 
      filter: "active",
      sort: "name",
      page: 1,
      limit: 10,
      async: true
    }
}

const url = linksmith(mainUrl, options);

console.log(url);
// Output: "https://api.v1.example.com:3000/users/123?filter=active&sort=name&page=1&limit=10&async=true"
 

```

## IPv4 and IPv6 examples

```ts README.md
import linksmith from 'linksmith'

// IPv4 example (with port)
const ipv4 = 'http://192.168.0.1'
const ipv4Result = linksmith(ipv4, { port: 3000 })
console.log(ipv4Result)
// Output: "http://192.168.0.1:3000/"
```

```ts README.md
import linksmith from 'linksmith'

// IPv6 example (bracketed literal) — note IPv6 literals must be bracketed
// when a port is present per URL syntax.
const ipv6 = 'http://[2001:db8::1]:8080'
const ipv6Result = linksmith(ipv6, { port: 3000 })
console.log(ipv6Result)
// Output: "http://[2001:db8::1]:3000/"
```

```ts README.md
import linksmith from 'linksmith'

// Attempting to add subdomains to an IP address (IPv4 or IPv6) will throw
// an error. This prevents creating invalid hostnames like "api.192.168.0.1".
try {
  linksmith('http://192.168.0.1', { subDomains: ['api'] })
} catch (err) {
  console.error(err.message)
  // Output: "You can't add subdomain to an ip address"
}

try {
  linksmith('[2001:db8::1]', { subDomains: ['api'] })
} catch (err) {
  console.error(err.message)
  // Output: "You can't add subdomain to an ip address"
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
