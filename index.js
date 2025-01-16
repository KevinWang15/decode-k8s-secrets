#!/usr/bin/env node
const yaml = require('js-yaml');

// Buffer to accumulate YAML document chunks
let currentDoc = '';

// Process stdin in chunks
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
    currentDoc += chunk;

    // Process any complete YAML documents
    while (currentDoc.includes('---')) {
        const splitIndex = currentDoc.indexOf('---');
        const docToParse = currentDoc.slice(0, splitIndex);
        currentDoc = currentDoc.slice(splitIndex + 3); // Remove the processed document and separator

        if (docToParse.trim()) {
            processYamlDocument(docToParse);
        }
    }
});

process.stdin.on('end', () => {
    // Process any remaining YAML document
    if (currentDoc.trim()) {
        processYamlDocument(currentDoc);
    }
});

function processYamlDocument(yamlStr) {
    try {
        // Parse YAML document
        const doc = yaml.load(yamlStr);

        if (doc) {
            // Handle both single resources and lists
            if (doc.items) {
                // Process each item in the list
                doc.items = doc.items.map(item => processResource(item));
            } else {
                // Process single resource
                processResource(doc);
            }
        }

        // Output the processed document
        console.log('---');
        console.log(yaml.dump(doc));
    } catch (error) {
        console.error('Error processing YAML document:', error);
    }
}

function processResource(resource) {
    // Process if it's a Secret or has data field
    if (resource && resource.data) {
        resource.stringData = resource.stringData || {};

        // Process each field in data
        for (const [key, value] of Object.entries(resource.data)) {
            try {
                resource.stringData[key] = Buffer.from(value, 'base64').toString('utf8');
            } catch (error) {
                console.error(`Failed to decode ${key}:`, error);
                // Keep the original value in stringData if decoding fails
                resource.stringData[key] = value;
            }
        }

        // Remove the data field
        delete resource.data;
    }

    return resource;
}