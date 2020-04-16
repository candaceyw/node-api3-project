require('dotenv').config();
const express = require('express'); // importing a CommonJS module
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');

const server = express();
const cors = require('cors');
const helmet = require('helmet');

// built-in middleware
server.use(express.json());

// 3rd party
server.use(helmet());
server.use(cors());

//custom from function below
server.use(logger);

// server.use('/', postRouter);
server.use('/users', userRouter);
server.use('/posts', postRouter);

server.get('/', (req, res) => {
	res.send(`<h2>Let's write some middleware, ${process.env.AUTHKEY}</h2>`);
});

//custom middleware

function logger(req, res, next) {
	console.log(`${new Date().toISOString()} ${req.ip} ${req.method} ${req.url}`);
	next();
}

module.exports = server;
