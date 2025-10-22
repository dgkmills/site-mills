// screenshot.js - Using External API for faster, cheaper builds.

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // Required for HTTP requests in Node.js

// IMPORTANT: SET THIS IN YOUR NETLIFY ENVIRONMENT VARIABLES FOR SECURITY
const API_KEY = process.env.SCREENSHOTONE_API_KEY || 'YOUR_SCREENSHOT_API_KEY';

// The base URL of the site to be screened
const LIVE_BASE_URL = 'https://myteacherdan.com';

// Define the pages to screenshot and where to save the images
const screenshots = [
    {
        // Target: My Teacher Dan thumbnail
        url: 'https://myteacherdan.com', 
        filepath: path.join(__dirname, 'assets', 'images', 'tdanthumb.png'), 
        // We'll focus the screenshot on the main section for a clean crop
        options: { selector: '.main-container', quality: 90 } 
    },
    {
        // Target: Almanac Utility Tool thumbnail
        url: 'https://almanac.danmills.dev', 
        filepath: path.join(__dirname, 'assets', 'images', 'almanac-thumb.png'), 
        options: { selector: '#main-content', quality: 80 }
    },
    {
        // Target: Email Assist AI thumbnail
        url: 'https://email-assist.danmills.dev', 
        filepath: path.join(__dirname, 'assets', 'images', 'email-assist-thumb.png'), 
        options: { selector: '#app-container', quality: 80 }
    }
];

async function generateScreenshot(targetUrl, options) {
    const defaultParams = {
        access_key: API_KEY,
        url: targetUrl,
        // Common parameters for a portfolio thumbnail
        format: 'png',
        viewport_width: 1280,
        viewport_height: 720,
        delay: 3, // Wait 3 seconds for content to fully load
        // Merge with custom options
        ...options
    };

    // Construct the query string from parameters
    const queryString = Object.keys(defaultParams)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(defaultParams[key])}`)
        .join('&');

    const apiUrl = `https://api.screenshotone.com/take?${queryString}`;
    
    // --- Fetch the screenshot image ---
    const response = await fetch(apiUrl);

    if (response.ok) {
        return response.buffer();
    } else {
        const errorText = await response.text();
        throw new Error(`Screenshot API Error (Status ${response.status}): ${errorText}`);
    }
}

async function runAutomation() {
    if (API_KEY === 'YOUR_SCREENSHOT_API_KEY') {
        console.warn("WARNING: SCREENSHOTONE_API_KEY is missing. Skipping external API call.");
        console.warn("Please set the 'SCREENSHOTONE_API_KEY' environment variable in Netlify.");
        return; 
    }

    // Ensure the image directory exists
    const imageDir = path.join(__dirname, 'assets', 'images');
    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
    }

    for (const screenshot of screenshots) {
        try {
            console.log(`\nGenerating screenshot for: ${screenshot.url}`);
            const imageBuffer = await generateScreenshot(screenshot.url, screenshot.options);
            fs.writeFileSync(screenshot.filepath, imageBuffer);
            console.log(`✅ Screenshot saved to: ${path.basename(screenshot.filepath)}`);
        } catch (error) {
            console.error(`❌ FAILED to generate screenshot for ${screenshot.url}:`, error.message);
            // Don't re-throw the error, allow other screenshots to proceed and deploy the old images.
        }
    }
}

runAutomation();
