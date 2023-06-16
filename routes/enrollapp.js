const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

let courses = [
  { id: 1, name: '과목 A', time: '월 09:00 - 10:00' },
  { id: 2, name: '과목 B', time: '화 13:00 - 14:00' },
  { id: 3, name: '과목 C', time: '수 10:00 - 11:00' },
];

let enrolledCourses = [];

app.get('/', (req, res) => {
  res.render('index', { courses, enrolledCourses });
});

app.post('/enroll', (req, res) => {
  const courseId = parseInt(req.body.courseId);
  const course = courses.find(c => c.id === courseId);
  if (course) {
    enrolledCourses.push(course);
  }
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
