const express = require('express');

//app.use('/writing', writingRoutes);

let { mongoose } = require('./config/mongodb');
const { Writings } = require("./schemas/writingsSchema");


const app = express();
const PORT = 3000;
const cors = require('cors')
app.use(express.json());
app.use(cors());

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`server running on http://localhost:${PORT}`);
    }
});

/**
 * WRITING API
 */
app.post('/writing', async(req, res) => {
    try {
        const newWriting = new Writings ({
            text: req.body.text,
            date: req.body.date,
            location: req.body.location
        })
        const result = await newWriting.save();
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
            writing.firstname = req.body.text
        }
        if (req.body.date) {
            writing.lastname = req.body.date
        }
        if (req.body.location) {
            writing.email = req.body.location
        }
        await Writings.updateOne({ _id: req.params.id }, writing);
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
            res.status(404)
            res.send({ error: "Writing does not exist!" })
        }
    } catch {
        res.status(404)
        res.send({ error: "Something went wrong :(" })
    }
});