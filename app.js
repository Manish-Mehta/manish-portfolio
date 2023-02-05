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
app.listen(process.env.PORT || 5000, () => {
	infoLog(`Server started at ${process.env.PORT || 5000}, Waiting for DB connection`)
});
