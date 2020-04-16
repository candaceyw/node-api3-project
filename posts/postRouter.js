const express = require('express');
const postsDb = require('./postDb');

const router = express.Router();

router.get('/', (req, res) => {
	postsDb
		.get()
		.then((post) => {
			res.status(200).json(post);
		})
		.catch((error) => {
			next(err);
		});
});

router.get('/:id', (req, res) => {
	// do your magic!
});

router.delete('/:id', (req, res) => {
	// do your magic!
});

router.put('/:id', (req, res) => {
	// do your magic!
});

// custom middleware

function validatePostId(req, res, next) {
	// do your magic!
}

module.exports = router;
