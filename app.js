const envVars = require("./server/config/variables");
const express = require('express');
const app = express();
const server = require("./server");
const { info: infoLog } = require("./server/utils/logger");

//set the template engine ejs
app.set('view engine', 'ejs');
app.set('views', './public');

//middlewares
app.use(express.static('public'));

app.use('/', server.router);

//Listen on port 
app.listen(envVars.port, () => {
	infoLog(`Server started at ${envVars.port}`)
});
