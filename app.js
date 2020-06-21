const express = require('express');
const app = express();


//set the template engine ejs
app.set('view engine', 'ejs');
app.set('views', './public');

//middlewares
app.use(express.static('public'));

//routes
app.get('/', (req, res) => {

	const startDate = new Date('2016-7-1');
	const now = new Date();
	let year_experiance = ((now.getFullYear() - startDate.getFullYear()) * 12
		+ (now.getMonth() - startDate.getMonth()));

	year_experiance = `${Math.floor(year_experiance / 12)}Y ${year_experiance % 12}M`;
	res.render('./index.ejs', { year_experiance });
})

//Listen on port 3000
server = app.listen(process.env.PORT || 5000);
