const express = require('express');
const router = express.Router();
const { Writings } = require('../schemas/writingsSchema');
const webpush = require('web-push')
let { mongoose } = require('../config/mongodb');
require('dotenv').config();


/**
 *  PUSH NOTIF
 */
const publicVapidKey = process.env.PUBLIC_KEY;
const privateVapidKey = process.env.PRIVATE_KEY;
const pushSubscription = {
    endpoint: 'https://fcm.googleapis.com/fcm/send/dsGiMQR075Q:APA91bEgGw1mlyEVVMWekFgyTF_YXxjZJWYsQATucT-uMTx3FrrW5tOYQ5Ii0uad9L5LzJ4VDnBBEzRHpB-ALninJOHUv5cwVicv-QmkntGqV_GeFu91ly2orHP1u9i6vtoF2Pz4SfL-',
    keys: {
        p256dh: 'BAQgZsvrvy_BTgnnzHIDE3uFrsulqd9xxCcSHwXC4zb0qITUudroqFyIqssA6F5q7JT92HGYpP37q79iKEz4MMU',
        auth: 'JxKZLfDaF-BNz9s2Gu7jJQ'
    }
};

function sendNotification(message) {
    webpush.setVapidDetails('mailto:aiiden.dov@gmail.com', publicVapidKey, privateVapidKey);
    const payload = JSON.stringify({
        title: 'New Push Notification',
        content: message,
        openUrl: 'https://freiheit.f4.htw-berlin.de/ikt/'
    });
    webpush.sendNotification(pushSubscription,payload)
        .catch(err => console.error(err));
    console.log('push notification sent');
    // res.status(201).json({ message: 'push notification sent'});
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
        sendNotification('Entry was saved in database :)');
        res.status(201);
        res.send(result);

    }catch {
        res.status(404);
        res.send({
            error: "Writing could not be saved! "
        })
    }
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
            error: "Writings could not be read!"
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
        sendNotification('Entry with id ' + req.params.id + ' was updated :)');
        res.status(200);
        res.send(writing)
    } catch {
        res.status(404)
        res.send({ error: "Member does not exist!" })
    }
});

router.delete('/:id', async(req, res) => {
    try {
        const writing = await Writings.deleteOne({ _id: req.params.id })
        console.log('writing', writing)
        if(writing.deletedCount === 1) {
            sendNotification('Entry with id '+ req.params.id + ' was deleted :)');
            res.status(204)
            res.send( { message: "Writing deleted" })
        } else {
            res.status(400)
            res.send({ error: "Writing does not exist!" })
        }
    } catch {
        res.status(404)
        res.send({ error: "Something went wrong :(" })
    }
});

module.exports = router;
