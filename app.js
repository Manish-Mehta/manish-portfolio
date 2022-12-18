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
});

app.get('/health', (req, res) => {
	res.end("success");
});

//Listen on port 
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server started at ${process.env.PORT || 5000}`)
});
