const express = require('express');
const server = require('./server.js');

const port = 5500;

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
