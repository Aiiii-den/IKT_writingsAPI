const express = require('express');

const writingRoutes = require('./routes/writingRoutes');
const subscriptionRoute = require('./routes/subscriptionRoutes');

const app = express();
const PORT = 3000;
const cors = require('cors')

app.use(express.json());
app.use(cors({
    origin: ['*'],
    headers: ["Content-Type"],
}));
app.options('*', cors())
app.use('/writing', writingRoutes);
app.use('/subscription', subscriptionRoute);

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`server running`);
    }
});



