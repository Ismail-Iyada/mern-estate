/**
 * This is the main entry point of the API server.
 */

import express from 'express';

const app = express();

/**
 * Starts the server on port 3000.
 * @callback
 * but as its normal state, the server will not automatically 
 * restart when the code changes.
 * thats why i installed nodemon to restart the server automatically
 * using a script in the package.json file
 * npm run dev -> "dev": "nodemon src/index.js"
 * npm start -> "start": "node src/index.js"
 */
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});