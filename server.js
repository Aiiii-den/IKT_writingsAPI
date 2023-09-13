const express = require('express');

const writingRoutes = require('./routes/writingRoutes');
const subscriptionRoute = require('./routes/subscriptionRoutes');

const app = express();
const PORT = 3000;
const cors = require('cors')

app.use(express.json());
app.use(cors({
    origin: ['https://localhost:8080/', 'https://localhost:8081/', 'https://localhost:8082/', 'https://ikt-frontend-new.vercel.app/', 'https://ikt-frontend-new-git-main-aiiii-den.vercel.app/', 'https://ikt-frontend-kord9vk6t-aiiii-den.vercel.app/']
}));
app.options('*', cors())

app.use(cors());
app.use('/writing', writingRoutes);
app.use('/subscription', subscriptionRoute);

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`server running`);
    }
});



