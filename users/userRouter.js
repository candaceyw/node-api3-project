const express = require('express');
const userDb = require('./userDb');
const postsDb = require('../posts/postDb');

const router = express.Router();

router.use((req, res, next) => {
	console.log('user router');
	next();
});

// add a new user to db with validateUser middleware
router.post('/', validateUser, (req, res, next) => {
	userDb
		.insert(req.body)
		.then((user) => res.status(200).json(user))
		.catch((error) => {
			next(error);
		});
});

// add a new post by id with validatePost and validateUserId middleware
router.post('/:id/posts', validateUserId, validatePost, (req, res, next) => {
	const { text } = req.body;
	const { id: user_id } = req.params;
	postsDb
		.insert({ text, user_id })
		.then((post) => {
			res.status(200).json(post);
		})
		.catch((error) => {
			next(error);
		});
});

// return all users
router.get('/', (req, res, next) => {
	userDb
		.get()
		.then((users) => {
			res.status(200).json({ users });
		})
		.catch((error) => {
			next(error);
		});
});

// return user by id with validateUserId middleare
router.get('/:id', validateUserId, (req, res, next) => {
	res.status(200).json(req.users);
});

// return all post from user Id with validateUserId middleware
router.get('/:id/posts', validateUserId, (req, res) => {
	userDb
		.getUserPosts(req.params.id)
		.then((posts) => {
			res.status(200).json(posts);
		})
		.catch((error) => {
			next(error);
		});
});

// delete a user by id with validateUserId middleware
router.delete('/:id', validateUserId, (req, res) => {
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
			next(error);
		});
});

// change a user by id with validateUser and validateUserId middleware
router.put('/:id', validateUser, validateUserId, (req, res) => {
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

// validate user by id middleware
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

// validate usermiddleware
function validateUser(req, res, next) {
	const name = req.body.name;
	!name || name === {}
		? res.status(400).json({ message: 'Need to add name' })
		: next();
}

// validate post usermiddleware
function validatePost(req, res, next) {
	if (!req.body) {
		return res.status(400).json({ message: 'missing post text' });
	} else if (!req.body.text) {
		return res.status(400).json({ message: 'missing required text field' });
	}
	next();
}

module.exports = router;
