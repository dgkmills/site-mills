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
  return new Promise((resolve) => { // Changed to only resolve
    const apiKey = process.env.SCREENSHOTONE_API_KEY;

    // Check if the API key is provided
    if (!apiKey) {
      console.warn('SCREENSHOTONE_API_KEY environment variable is not set. Skipping screenshot generation.');
      // Resolve successfully to avoid failing the build if key is missing
      return resolve(); 
    }

    // Construct the API URL
    // Added viewport_width for better layout consistency
    const apiUrl = `https://api.screenshotone.com/take?access_key=${apiKey}&url=${encodeURIComponent(url)}&full_page=false&block_cookie_banners=true&block_ads=true&viewport_width=1200&viewport_height=800&device_scale_factor=1&format=png`;

    console.log(`Fetching screenshot for: ${url}`);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          // Log API error but don't fail the build
          console.error(`API request failed for ${url} with status ${response.status}: ${response.statusText}`);
          return resolve(); // Resolve instead of reject
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
          console.error(`File stream error for ${imagePath}:`, err);
          resolve(); // Resolve instead of reject to not fail build
        });
      })
      .catch(err => {
        console.error(`Error fetching screenshot for ${url}:`, err);
        resolve(); // Resolve instead of reject to not fail build
      });
  });
};

// List of sites to screenshot
const sites = [
  { url: 'https://myteacherdan.com/', filename: 'tdanthumb.png' },
  { url: 'https://portal.myteacherdan.com/', filename: 'portalthumb.png' },
  { url: 'https://drkha.danmills.dev/', filename: 'drkhathumb.png' },
  { url: 'https://stocktool.danmills.dev/', filename: 'stocktoolthumb.png' },
  { url: 'https://almanac.danmills.dev/', filename: 'almanac-thumb.png' },
  { url: 'https://dialogue.danmills.dev/', filename: 'dialogue-thumb.png' },
  { url: 'https://pronunciation.danmills.dev/', filename: 'pronunciation-thumb.png' },
  { url: 'https://email-assist.danmills.dev/', filename: 'email-assist-thumb.png' },
  { url: 'https://mattsworld.myteacherdan.com/', filename: 'mattsworld-thumb.png' },
  { url: 'https://aree.myteacherdan.com/', filename: 'areethumb.png' }
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
  
  // Create an array of promises
  const screenshotPromises = sites.map(site => {
    const imagePath = path.join(screenshotsDir, site.filename);
    return takeScreenshot(site.url, imagePath);
  });

  try {
    // Run all screenshot tasks in parallel
    await Promise.all(screenshotPromises);
    console.log('All screenshot tasks finished.');
  } catch (error) {
    // This catch block might not be strictly necessary since takeScreenshot now resolves on error,
    // but it's good practice.
    console.error('An unexpected error occurred during screenshot processing:', error);
    // We don't process.exit(1) here to ensure the build can continue even if screenshots fail.
  }
})();

