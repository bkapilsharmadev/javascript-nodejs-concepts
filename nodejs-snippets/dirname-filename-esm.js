import { dirname } from 'path'; // Import the utility to get the directory name
import { fileURLToPath } from 'url'; // Import the utility to convert URLs to file paths

// Convert the module's `import.meta.url` (a file:// URL) into a file path
const __filename = fileURLToPath(import.meta.url);

// Get the directory part of the file path
const __dirname = dirname(__filename);

// Log the results
console.log(__filename); // Full path of the current file
console.log(__dirname);  // Directory path of the current file
