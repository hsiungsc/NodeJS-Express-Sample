const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load helper
const {ensureAuthenticated} = require('../helpers/auth');

// Load Thing model
require('../models/Thing');
const Thing = mongoose.model('things')

// Thing index page
router.get('/', ensureAuthenticated, (req, res) => {
	Thing.find({user: req.user.id})
		.sort({date: 'desc'})
		.then(things => {
			res.render('things/index', {
				things: things
			});
		})
})

// Add new thing form
router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('things/add');
});

// Edit thing form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	Thing.findOne({
		_id: req.params.id
	})
	.then(thing => {
		if(thing.user != req.user.id) {
			req.flash('error_msg', 'Not Authorized!');
			res.redirect('/things');
		} else {
			res.render('things/edit', {
				thing: thing
			});
		}
	})
});

// Process form
router.post('/', ensureAuthenticated, (req, res) => {
	let errors = [];

	if(!req.body.subject) {
		errors.push({text: 'Please add subject'})
	}
	if(!req.body.details) {
		errors.push({text: 'Please add details'})
	}

	if(errors.length > 0) {
		res.render('things/add', {
			errors: errors,
			subject: req.body.subject,
			details: req.body.details
		});
	} else {
		const newThing = {
			subject: req.body.subject,
			details: req.body.details,
			user: req.user.id,
			category: req.body.category,
			priority: req.body.priority,
			status: req.body.status,
			link: req.body.link,
			deadline: req.body.deadline
		}
		new Thing(newThing)
			.save()
			.then(thing => {
				req.flash('success_msg', 'New thing has been added!')
				res.redirect('/things');
			})
	}
});

// Edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
	Thing.findOne({
		_id: req.params.id
	})
	.then(thing => {
		// New values
		thing.subject = req.body.subject;
		thing.details = req.body.details;
		thing.category = req.body.category;
		thing.priority = req.body.priority;
		thing.status = req.body.status;
		thing.deadline = req.body.deadline;

		thing.save()
			.then(thing => {
				req.flash('success_msg', 'Thing has been updated!')
				res.redirect('/things')
			});
	})
})

// Delete thing
router.delete('/:id', ensureAuthenticated, (req, res) => {
	Thing.remove({_id: req.params.id})
		.then(() => {
			req.flash('success_msg', 'Thing has been removed.')
			res.redirect('/things');
		})
});


module.exports = router;