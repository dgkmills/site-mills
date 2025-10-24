// This script runs during the Netlify build process to generate screenshots.

// Using node-fetch v2, which works with the 'require' syntax.
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

/**
 * Fetches a screenshot from ScreenshotOne API and saves it to a file.
 * @param {string} url - The URL to screenshot.
 * @param {string} imagePath - The full path to save the image file.
 */
const takeScreenshot = (url, imagePath) => {
  // We wrap this in a Promise to use await, as streaming isn't natively await-able.
  return new Promise((resolve, reject) => {
    const apiKey = process.env.SCREENSHOTONE_API_KEY;

    // Check if the API key is provided
    if (!apiKey) {
      console.error('SCREENSHOTONE_API_KEY environment variable is not set.');
      return reject(new Error('Missing API key.'));
    }

    // Construct the API URL
    const apiUrl = `https://api.screenshotone.com/take?access_key=${apiKey}&url=${encodeURIComponent(url)}&full_page=true&block_cookie_banners=true&block_ads=true`;

    console.log(`Fetching screenshot for: ${url}`);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
        }
        
        // Create a write stream to the target file path
        const fileStream = fs.createWriteStream(imagePath);
        
        // Pipe the response body (the image) directly to the file
        response.body.pipe(fileStream);

        // Handle successful stream completion
        fileStream.on('finish', () => {
          console.log(`Successfully saved screenshot to: ${imagePath}`);
          resolve();
        });

        // Handle errors during the stream
        fileStream.on('error', (err) => {
          console.error('File stream error:', err);
          reject(err);
        });
      })
      .catch(err => {
        console.error(`Error fetching screenshot for ${url}:`, err);
        reject(err);
      });
  });
};

// List of sites to screenshot
const sites = [
  { url: 'https://almanac.danmills.dev/', filename: 'almanac-thumb.png' },
  { url: 'https://dialogue.danmills.dev/', filename: 'dialogue-thumb.png' },
  { url: 'https://email-assist.danmills.dev/', filename: 'email-assist-thumb.png' },
  { url: 'https://mattsworld.myteacherdan.com/', filename: 'mattsworld-thumb.png' },
  { url: 'https://pronunciation.danmills.dev/', filename: 'pronunciation-thumb.png' },
  { url: 'https://stocktool.danmills.dev/', filename: 'stocktoolthumb.png' },
  { url: 'https://myteacherdan.com/', filename: 'tdanthumb.png' }
];

// Define the directory to save screenshots
// '__dirname' refers to the current directory, which is your project root.
const screenshotsDir = path.join(__dirname, 'assets', 'images');

// Ensure the directory exists
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Main function to run the screenshots
// Using an Immediately Invoked Function Expression (IIFE) to use async/await
(async () => {
  console.log('Starting screenshot generation process...');
  
  try {
    // Loop through all sites and take screenshots sequentially
    for (const site of sites) {
      const imagePath = path.join(screenshotsDir, site.filename);
      await takeScreenshot(site.url, imagePath);
    }
    console.log('All screenshots generated successfully!');
  } catch (error) {
    console.error('Screenshot generation failed:', error);
    // Exit with an error code to fail the build if screenshots fail
    process.exit(1);
  }
})();

