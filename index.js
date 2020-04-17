// require('dotenv').config();

const server = require('./server.js');

const port = process.env.PORT || 5500;

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
