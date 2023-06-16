const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

let grades = [];

app.get('/', (req, res) => {
  res.render('index', { grades });
});

app.post('/grade', (req, res) => {
  const { subject, score } = req.body;
  const newGrade = {
    subject: subject,
    score: parseInt(score),
  };
  grades.push(newGrade);
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
