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