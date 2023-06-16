const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

let schedules = [];

app.get('/', (req, res) => {
  res.render('index', { schedules });
});

app.post('/schedule', (req, res) => {
  const { day, startTime, endTime, title } = req.body;
  const newSchedule = {
    day: parseInt(day),
    startTime: parseInt(startTime),
    endTime: parseInt(endTime),
    title: title
  };
  schedules.push(newSchedule);
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
