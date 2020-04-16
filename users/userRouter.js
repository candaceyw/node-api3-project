const express = require('express');
const userDb = require('./userDb');
const postsDb = require('../posts/postDb');

const router = express.Router();

router.use((req, res, next) => {
	console.log('user router');
	next();
});

router.post('/', (req, res, next) => {
	userDb
		.insert(req.body)
		.then((user) => res.status(200).json(user))
		.catch((error) => {
			// log error to server
			console.log(error);
			res.status(500).json({
				message: 'Error adding the hub',
			});
		});
});

router.post('/:id/posts', (req, res, next) => {
	postsDb
		.insert(req.params.id, req.body.text)
		.then((post) => {
			res.status(200).json(post);
		})
		.catch((error) => {
			next(error);
		});
});

router.get('/', (req, res, next) => {
	userDb
		.get()
		.then((users) => {
			res.status(200).json({ users });
		})
		.catch((error) => {
			res.status(500).json({
				error: 'Could not process your request',
			});
		});
});

router.get('/:id', validateUserId, (req, res, next) => {
	res.status(200).json(req.users);
});
// 	userDb
// 		.getById(req.params.id)
// 		.then((user) => {
// 			if (user) {
// 				res.json(user);
// 			} else {
// 				res.status(404).json({ message: "This user Id doesn't exist" });
// 			}
// 		})
// 		.catch((error) => {
// 			res
// 				.status(500)
// 				.json({ error: 'The user information could not be retrieved.' });
// 		});
// });

router.get('/:id/posts', (req, res) => {
	userDb
		.getUserPosts(req.params.id)
		.then((posts) => {
			res.status(200).json(posts);
		})
		.catch((error) => {
			// log error to server
			console.log(error);
			res.status(500).json({
				message: 'Error getting the messages for the hub',
			});
		});
});

router.delete('/:id', (req, res) => {
	userDb
		.remove(req.params.id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({ message: 'The user has been nuked' });
			} else {
				res.status(404).json({ message: 'The user could not be found' });
			}
		})
		.catch((error) => {
			// log error to server
			console.log(error);
			res.status(500).json({
				message: 'Error removing the user',
			});
		});
});

router.put('/:id', (req, res) => {
	userDb
		.update(req.params.id, req.body)
		.then((user) => {
			if (user) {
				res.status(200).json(user);
			} else {
				res.status(404).json({ message: 'The user could not be found' });
			}
		})
		.catch((error) => {
			// log error to server
			console.log(error);
			res.status(500).json({
				message: 'Error updating the user',
			});
		});
});

//custom middleware

function validateUserId(req, res, next) {
	const { id } = req.params;

	userDb
		.getById(id)
		.then((users) => {
			if (users) {
				req.users = users;
				next();
			} else {
				res.status(404).json({ message: 'user id not found' });
			}
		})
		.catch((err) => {
			res.status(500).json({ message: 'failed', err });
		});
}

function validateUser(req, res, next) {
	// do your magic!
}

function validatePost(req, res, next) {
	// do your magic!
}

module.exports = router;
