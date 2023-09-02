const express = require('express');

//app.use('/writing', writingRoutes);
const subscriptionRoute = require('./routes/subscriptionRoutes');

let { mongoose } = require('./config/mongodb');
const { Writings } = require("./schemas/writingsSchema");

/**
 *  subscription start
 */
require('dotenv').config();
const webpush = require('web-push');

const publicVapidKey = process.env.PUBLIC_KEY;
const privateVapidKey = process.env.PRIVATE_KEY;
const pushSubscription = {
    endpoint: 'https://fcm.googleapis.com/fcm/send/dsGiMQR075Q:APA91bEgGw1mlyEVVMWekFgyTF_YXxjZJWYsQATucT-uMTx3FrrW5tOYQ5Ii0uad9L5LzJ4VDnBBEzRHpB-ALninJOHUv5cwVicv-QmkntGqV_GeFu91ly2orHP1u9i6vtoF2Pz4SfL-',
    keys: {
        p256dh: 'BAQgZsvrvy_BTgnnzHIDE3uFrsulqd9xxCcSHwXC4zb0qITUudroqFyIqssA6F5q7JT92HGYpP37q79iKEz4MMU',
        auth: 'JxKZLfDaF-BNz9s2Gu7jJQ'
    }
};

/**
 * subscription end (kind of)
 */


const app = express();
const PORT = 3000;
const cors = require('cors')
app.use(express.json());
app.use(cors());
app.use('/subscription', subscriptionRoute);

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`server running on http://localhost:${PORT}`);
    }
});


/**
 *  Push notif implementation
 */
function sendNotification() {
    webpush.setVapidDetails('mailto:aiiden.dov@gmail.com', publicVapidKey, privateVapidKey);
    const payload = JSON.stringify({
        title: 'New Push Notification',
        content: 'Data was saved in database :)',
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
app.post('/writing', async(req, res) => {
    try {
        const newWriting = new Writings ({
            text: req.body.text,
            date: req.body.date,
        })
        const result = await newWriting.save();
        sendNotification();
        res.status(201);
        res.send(result);

    }catch {
        res.status(404);
        res.send({
            error: "Writing could not be saved! "
        })
    }
});

app.get('/writing', async(req, res) => {
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

app.patch('/writing/:id', async(req, res) => {
    try {
        const writing = await Writings.findOne({ _id: req.params.id })
        if (req.body.text) {
            writing.text = req.body.text
        }
        if (req.body.date) {
            writing.date = req.body.date
        }
        await Writings.updateOne({ _id: req.params.id }, writing);
        res.status(200);
        res.send(writing)
    } catch {
        res.status(404)
        res.send({ error: "Member does not exist!" })
    }
});

app.delete('/writing/:id', async(req, res) => {
    try {
        const writing = await Writings.deleteOne({ _id: req.params.id })
        console.log('writing', writing)
        if(writing.deletedCount === 1) {
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