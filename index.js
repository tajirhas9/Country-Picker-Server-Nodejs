const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.set('port', (process.env.PORT || 8000));

app.use(cors());
app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

require('./api/postgres_client')(app);
require('./api/country_list')(app);

app.get("/", (req, res) => {
    console.log("Request recieved. Sending Greeting...");
    res.send(JSON.stringify("Hello there!"));
    console.log("[+] Success");
});

app.listen(app.get('port'), () => {
    console.log("Server is running on port: " + app.get('port'));
});
