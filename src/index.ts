/**
 * Constructs a URL by appending subdomains, paths, and query parameters to a given base URL.
 * 
 * @param mainUrl - The base URL to which subdomains, paths, and query parameters will be added.
 * @param options - Optional object containing:
 *  - subDomains - An array of subdomains to be added to the base URL.
 *  - paths - An array of path components to be appended to the base URL.
 *  - queryParams - An object representing query parameters to be appended to the URL.
 * 
 * @returns The constructed URL as a string, including subdomains, paths, and query parameters.
 * 
 * @example
 * const url = linksmith("https://example.com", {
 *     subDomains: ["api", "v1"],
 *     paths: ["users", "123"],
 *     queryParams: { filter: "active", sort: "name" }
 * });
 * console.log(url);
 * // Output: "https://api.v1.example.com/users/123?filter=active&sort=name"
 */
export default function linksmith(
    mainUrl: string,
    options?: {
        subDomains?: string[],
        paths?: string[],
        queryParams?: { [key: string]: string }
    }
): string {

    // Ensure the base URL is not empty.
    if (mainUrl == "") throw new Error("Main URL is empty");

    // Make sure the base URL ends with a "/".
    mainUrl = mainUrl.endsWith('/') ? mainUrl : `${mainUrl}/`;

    // Check if options are provided and proceed with modifying the URL.
    if (options != undefined) {

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

        // Create a new URL object from the modified mainUrl.
        const url = new URL(mainUrl);

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
