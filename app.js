const express = require('express')
const cors = require('cors')
const app = express()
const router = require('./router/index');
const bodyParser = require("body-parser");
const env = require('dotenv')

env.config();
app.use(cors())
require('./server');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json())
app.use(express.json({limit: "50mb"}))
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}))

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    })
})

app.use('/api', router)

app.listen(process.env.PORT, () => {
    console.log(`PORT ${process.env.PORT} `);
})
