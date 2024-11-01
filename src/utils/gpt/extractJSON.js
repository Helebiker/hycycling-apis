function extractJSON(gptResponse) {
    try {
        // Locate the first and last curly braces in the response
        const startIdx = gptResponse.indexOf('{');
        const endIdx = gptResponse.lastIndexOf('}');
        
        // Check if we found a valid JSON structure
        if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) {
            throw new Error('No valid JSON found in the GPT response.');
        }

        // Extract the JSON substring
        const jsonString = gptResponse.substring(startIdx, endIdx + 1);
        
        // Parse the JSON
        const parsedData = JSON.parse(jsonString);
        
        return parsedData;
    } catch (error) {
        console.error('Error extracting JSON:', error);
        throw new Error('Failed to extract valid JSON from GPT response.');
    }
}

module.exports = extractJSON;
