const express = require('express');
const router = express.Router();
const { Writings } = require('../schemas/writingsSchema');
const webpush = require('web-push')
let { mongoose } = require('../config/mongodb');
require('dotenv').config();
let pushMessage = '';


/**
 *  PUSH NOTIF
 */
const publicVapidKey = process.env.PUBLIC_KEY;
const privateVapidKey = process.env.PRIVATE_KEY;
const pushSubscription = {
    endpoint: process.env.ENDPOINT,
    keys: {
        p256dh: process.env.P256DH_KEY,
        auth: process.env.AUTH_KEY
    }
};

function sendNotification(message) {
    try{
    webpush.setVapidDetails('mailto:aiiden.dev@gmail.com', publicVapidKey, privateVapidKey);
    const payload = JSON.stringify({
        title: 'New Push Notification',
        content: message,
        openUrl: 'https://freiheit.f4.htw-berlin.de/ikt/'
    });
    webpush.sendNotification(pushSubscription,payload)
        .catch(err => console.error(err));
    console.log('push notification sent');
    }catch{
        console.log('push notif could not be send')
    }

}

/**
 * WRITINGS API
 */
router.post('', async(req, res) => {
    try {
        const newWriting = new Writings ({
            text: req.body.text,
            date: req.body.date,
        })
        const result = await newWriting.save();
        pushMessage = 'Entry was saved in database :)'
        res.status(201);
        res.send(result);

    }catch {
        pushMessage = "Writing could not be saved!"
        res.status(404);
        res.send({
            error: "Writing could not be saved!"
        })
    }
    sendNotification(pushMessage);
});

router.get('', async(req, res) => {
    try{
        Writings.find({
        }).then(async (Writings) => {
            console.log(Writings);
            res.status(200);
            res.send(Writings);
        })
    } catch {
        res.status(404);
        res.send({
            error: "Writings could not be read :("
        })
    }
});

router.patch('/:id', async(req, res) => {
    try {
        const writing = await Writings.findOne({ _id: req.params.id })
        if (req.body.text) {
            writing.text = req.body.text
        }
        if (req.body.date) {
            writing.date = req.body.date
        }
        await Writings.updateOne({ _id: req.params.id }, writing);
        pushMessage= 'Entry with id ' + req.params.id + ' was updated :)';
        res.status(200);
        res.send(writing)
    } catch {
        pushMessage = "Writing could not be updated :("
        res.status(404)
        res.send({ error: "Writing could not be updated :(" })
    }
    sendNotification(pushMessage);
});

router.delete('/:id', async(req, res) => {
    try {
        const writing = await Writings.deleteOne({ _id: req.params.id })
        console.log('writing', writing)
            pushMessage = 'Entry with id '+ req.params.id + ' was deleted :)';
            res.status(204)
            res.send( { message: "Writing deleted" })
    } catch {
        pushMessage = "Writing could not be deleted :("
        res.status(404)
        res.send({ error: "Writing could not be deleted :(" })
    }
    sendNotification(pushMessage);
});

module.exports = router;
