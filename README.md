![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.3.1-orange)

# linksmith

Linksmith is a flexible and powerful TypeScript-based URL builder for Node.js and frontend projects. Designed for developers who need to construct clean and efficient URLs, linksmith allows seamless addition of subdomains, paths, and query parameters with a simple, intuitive API. Linksmith handles edge cases like double slashes, missing query values, and dynamic subdomain additions, making it ideal for RESTful APIs, microservices, and other projects requiring dynamic URL generation. Linksmith is your all-in-one solution for URL construction in TypeScript.

- [linksmith](#linksmith)
  - [Key Features](#key-features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Input table](#input-table)
  - [Options table](#options-table)
  - [Example](#example)
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

```TS
import linksmith from 'linksmith'

...

const mainUrl = "https://example.com"
const options = {
    port: 3000,
    subDomains: ["api", "v1"],
    paths: ["users", "123"],
    queryParams: { filter: "active", sort: "name" }
}

const url = linksmith(mainUrl, options);

console.log(url);
// Output: "https://api.v1.example.com:3000/users/123?filter=active&sort=name"
 

```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
