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
        port?: string | number,
        subDomains?: string[],
        paths?: string[],
        queryParams?: { [key: string]: string }
    }
): string {

    // Ensure the base URL is not empty.
    if (mainUrl == "") throw new Error("Main URL is empty");

    // Check if options are provided and proceed with modifying the URL.
    if (options != undefined) {

        const www = "www."
        let hasWww = false
        let protocol = ""
        const protocolArr = ["http://", "https://"]

        // Store protocol
        protocolArr.forEach(item => {
            if (mainUrl.startsWith(item)) {
                const regex = new RegExp(`^${item}`)
                mainUrl.replace(regex, "")
                protocol = item
            }
        })

        // Handling www
        if (mainUrl.startsWith(www)) {
            const regex = new RegExp(www)
            mainUrl.replace(regex, "")
            hasWww = true
        }

        // Delete slash from mainUrl
        mainUrl = mainUrl.endsWith('/') ? mainUrl.replace(/\/$/, "") : mainUrl

        // Add port if exsits 
        mainUrl = options.port != undefined ? `${mainUrl}:${options.port}` : mainUrl


        // If subDomains are provided, append them to the base URL.
        if (options.subDomains != undefined) {
            let subDomains = "";

            options.subDomains.forEach(item => {
                subDomains += item + ".";
            });

            mainUrl = subDomains + mainUrl;
        }

        // If paths are provided, join and append them to the URL.
        if (options.paths != undefined) {
            let path = options.paths.join("/");
            mainUrl = `${mainUrl}/${path}`;
        }

        // March all elements
        const combinedUrl = hasWww ? protocol + www + mainUrl : protocol + mainUrl

        // Create a new URL object from the modified mainUrl.
        const url = new URL(combinedUrl);

        // If queryParams are provided, append them to the URL.
        if (options.queryParams != undefined) {
            Object.entries(options.queryParams).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }

        // Return the fully constructed URL as a string.
        return url.toString();
    } else {
        // If no options are provided, return the base URL as is.
        return mainUrl;
    }
}
