const express = require('express');
const router = express.Router();
const {participants} = require('../data');
const auth = require('../middleware/auth')
/* GET home page. */
router.get('/', auth.isAdmin, function (req, res, next) {
    return res.send({status: 'success', total: participants.length, data: participants});
});

router.post('/add', auth.isAdmin, function (req, res, next) {
    const {email, firstname, lastname, dob} = req.body;
    if (!email) {
        return res.send({
            status: 'failed',
            message: 'email field is required'
        })
    }
    if (!firstname) {
        return res.send({
            status: 'failed',
            message: 'firstname field is required'
        })
    }
    if (!lastname) {
        return res.send({
            status: 'failed',
            message: 'lastname field is required'
        })
    }
    if (!dob) {
        return res.send({
            status: 'failed',
            message: 'dob field is required'
        })
    }
    if (!/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return res.send({
            status: 'failed',
            message: 'email format is incorrect'
        })
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
        return res.send({
            status: 'failed',
            message: 'dob should be in YYYY-MM-DD format i.e 2024-05-08'
        })
    }
    if (!req.body.work) {
        return res.send({
            status: 'failed',
            message: 'work object field is required'
        })
    }
    const {companyname, salary, currency} = req.body.work;
    if (!companyname) {
        return res.send({
            status: 'failed',
            message: 'work.companyname field is required'
        })
    }
    if (!salary) {
        return res.send({
            status: 'failed',
            message: 'work.salary field is required'
        })
    }
    if (!currency) {
        return res.send({
            status: 'failed',
            message: 'work.currency field is required'
        })
    }
    if (!req.body.home) {
        return res.send({
            status: 'failed',
            message: 'home object field is required'
        })
    }
    const {country, city} = req.body.home;
    if (!country) {
        return res.send({
            status: 'failed',
            message: 'home.country field is required'
        })
    }
    if (!city) {
        return res.send({
            status: 'failed',
            message: 'home.city field is required'
        })
    }
    if (participants.find((item) => item.email.toLowerCase() === email.toLowerCase())) {
        return res.send({
            status: 'failed',
            message: 'email already exists'
        })
    }
    req.body.active = true;
    participants.push(req.body)
    return res.send({
        status: 'success',
        data: req.body,
    });
});

router.get('/details', auth.isAdmin, function (req, res, next) {
    const activeParticipants = participants.filter((item) => item.active)
    return res.send({status: 'success', total: activeParticipants.length, data: activeParticipants});
});

router.get('/details/:email', auth.isAdmin, function (req, res, next) {
    const participant = participants.find((item) => item.email.toLowerCase() === req.params.email.toLowerCase())
    if (!participant) {
        return res.send({status: 'failed', message: 'participant not found', data: {}});
    }
    return res.send({status: 'success', data: participant});
});

router.get('/work/:email', auth.isAdmin, function (req, res, next) {
    const originalParticipant = participants.find((item) => item.email.toLowerCase() === req.params.email.toLowerCase())
    if (!originalParticipant) {
        return res.send({status: 'failed', message: 'participant not found', data: {}});
    }
    //Creating Copy
    const participant = {...originalParticipant};
    delete participant.home;
    return res.send({status: 'success', data: participant});
});

router.get('/home/:email', auth.isAdmin, function (req, res, next) {
    const originalParticipant = participants.find((item) => item.email.toLowerCase() === req.params.email.toLowerCase())
    if (!originalParticipant) {
        return res.send({status: 'failed', message: 'participant not found', data: {}});
    }
    //Creating Copy
    const participant = {...originalParticipant};
    delete participant.work;
    return res.send({status: 'success', data: participant});
});

router.delete('/:email', auth.isAdmin, function (req, res, next) {
    const participantIndex = participants.findIndex((item) => item.email.toLowerCase() === req.params.email.toLowerCase())
    if (participantIndex > -1) {
        participants.splice(participantIndex, 1);
        return res.send({status: 'success', message: 'participant deleted'});
    }
    return res.send({status: 'failed', message: 'participant not found'});
});

router.put('/:email', auth.isAdmin, function (req, res, next) {
    const participantIndex = participants.findIndex((item) => item.email.toLowerCase() === req.params.email.toLowerCase())
    if (participantIndex < 0) {
        return res.send({status: 'failed', message: 'participant not found'});
    }
    const {email, dob} = req.body;
    if (email && !/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return res.send({
            status: 'failed',
            message: 'email format is incorrect'
        })
    }
    if (dob && !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
        return res.send({
            status: 'failed',
            message: 'dob should be in YYYY-MM-DD format i.e 2024-05-08'
        })
    }

    if (participants.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.email.toLowerCase() !== req.params.email.toLowerCase())) {
        return res.send({
            status: 'failed',
            message: 'email already exists'
        })
    }
    if (participantIndex > -1) {
        participants[participantIndex] = {...participants[participantIndex], ...req.body}
        return res.send({status: 'success', message: 'participant updated'});
    }
    res.send({
        status: 'success',
        data: req.body,
    });
});

module.exports = router;
