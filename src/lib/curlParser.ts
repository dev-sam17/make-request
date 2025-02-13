type ParsedCurl = {
    method: string;
    body?: Record<string, unknown> | string;
    headers: Record<string, string>;
    baseUrl: string;
    urlPath: string;
    auth?: string;
    compressed: boolean;
    insecure: boolean;
};

export function parseCurlCommand(curlCommand: string): ParsedCurl {
    const result: ParsedCurl = {
        method: "GET",
        headers: {},
        baseUrl: "",
        urlPath: "",
        compressed: false,
        insecure: false,
    };

    // Normalize multi-line command
    curlCommand = curlCommand.replace(/\\\s*\n/g, " ").trim();

    const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig
    const headerRegex = /--header\s+['"]?([^:]+):\s*([^'"]+)['"]?/gi;
    const methodRegex = /--request\s+(\w+)/i;
    const dataRawRegex = /--data-raw\s+['`]([^'`]+)['`]/i;
    const dataUrlEncodeRegex = /--data-urlencode\s+['"]?([^=]+)=([^'"]+)['"]?/gi;
    const authRegex = /-u\s+['"]?([^:]+:[^'"]+)['"]?/i;

    // URL Parsing
    const urlMatch = curlCommand.match(urlRegex);
    if (urlMatch) {
        const url = new URL(urlMatch[0]);
        result.baseUrl = `${url.protocol}//${url.host}`;
        result.urlPath = url.pathname + url.search;
    } else {
        console.log("No URL found in the curl command.");
    }

    // HTTP Method Parsing
    const methodMatch = curlCommand.match(methodRegex);
    if (methodMatch) {
        result.method = methodMatch[1].toUpperCase();
    }

    // Header Parsing
    let headerMatch;
    while ((headerMatch = headerRegex.exec(curlCommand)) !== null) {
        result.headers[headerMatch[1].trim()] = headerMatch[2].trim();
    }

    // Parse --data-raw (JSON payload)
    const dataRawMatch = curlCommand.match(dataRawRegex);
    if (dataRawMatch) {
        try {
            const cleanedJson = dataRawMatch[1].replace(/(\r?\n|\t)/g, " ").trim(); // Remove newlines and tabs
            result.body = JSON.parse(cleanedJson);
        } catch (error) {
            console.warn("Failed to parse JSON body:", error);
            result.body = dataRawMatch[1]; // Return the raw body as a fallback
            console.log("Fallback to raw body:", result.body);
        }
    }

    // Parse --data-urlencode (URL-encoded form data)
    const urlEncodedBody: Record<string, string> = {};
    let dataUrlEncodeMatch;
    while ((dataUrlEncodeMatch = dataUrlEncodeRegex.exec(curlCommand)) !== null) {
        urlEncodedBody[dataUrlEncodeMatch[1].trim()] = dataUrlEncodeMatch[2].trim();
    }
    if (Object.keys(urlEncodedBody).length > 0) {
        result.body = urlEncodedBody;
        console.log("Final URL-encoded body:", result.body);
    }

    // Basic Auth Parsing
    const authMatch = curlCommand.match(authRegex);
    if (authMatch) {
        result.auth = authMatch[1];
        console.log("Parsed auth:", result.auth);
    }

    // Handle flags like --compressed and --insecure
    result.compressed = /--compressed/.test(curlCommand);
    result.insecure = /--insecure/.test(curlCommand);

    return result;
}
