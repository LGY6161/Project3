const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/assignment', (req, res) => {
  res.render('assignment');
});

app.post('/assignment', (req, res) => {
  const { title, description, dueDate } = req.body;
  const newAssignment = {
    title: title,
    description: description,
    dueDate: dueDate
  };
  assignments.push(newAssignment);

  res.send('과제가 등록되었습니다.');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
