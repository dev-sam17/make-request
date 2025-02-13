type ParsedCurl = {
    method: string;
    body?: Record<string, any> | string;
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

    const urlRegex = /curl\s+['"]?(https?:\/\/[^\s'"]+)['"]?/i;
    const headerRegex = /-H\s+['"]?([^:]+):\s*([^'"]+)['"]?/gi;
    const methodRegex = /-X\s+(\w+)/i;
    const dataRawRegex = /--data-raw\s+['`]([^'`]+)['`]/i;  // Supports both ' and ` quotes
    const dataUrlEncodeRegex = /--data-urlencode\s+['"]?([^=]+)=([^'"]+)['"]?/gi;
    const authRegex = /-u\s+['"]?([^:]+:[^'"]+)['"]?/i;

    // URL Parsing
    const urlMatch = curlCommand.match(urlRegex);
    if (urlMatch) {
        const url = new URL(urlMatch[1]);
        result.baseUrl = `${url.protocol}//${url.host}`;
        result.urlPath = url.pathname + url.search;
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
    }

    // Basic Auth Parsing
    const authMatch = curlCommand.match(authRegex);
    if (authMatch) {
        result.auth = authMatch[1];
    }

    // Handle flags like --compressed and --insecure
    result.compressed = /--compressed/.test(curlCommand);
    result.insecure = /--insecure/.test(curlCommand);

    return result;
}
