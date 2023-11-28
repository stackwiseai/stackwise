export default function handleWeirdObject(inputString) {
    // Regular expression to find keys without quotes
    const keyRegex = /([{,]\s*)(\w+)(?=:)/g;

    // Function to quote keys and values properly
    function quoteKeysAndValues(str) {
        return str.replace(keyRegex, '$1"$2"').split(',').map(item => {
            // Skip already properly formatted items
            if (/^\s*".+":\s*.+$/.test(item)) {
                return item.trim();
            }
            const key = item.trim();
            // Handle case where key-value pair is already correct
            if (key.includes(':')) {
                return key;
            }
            return `"${key}": ${key}`;
        }).join(', ');
    }

    // Replace unquoted keys with quoted keys and handle nested objects
    return inputString.replace(/(\{[^{}]*\})/g, (match) => {
        if (match.includes('{') && match.includes('}')) {
            return `{${quoteKeysAndValues(match.slice(1, -1))}}`;
        }
        return match;
    });
}

// Rest of your code for testing
