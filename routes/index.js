var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'public/'});
var mysql = require('mysql2');
var pool = mysql.createPool({
  connectionLimit: 5,
  host:'localhost',
  user:'root',
  password: 'qlalfqjsgh1234',
  database:'mydb'
});

/* 기본 로그인 페이지 */
router.get('/login', function(req,res, next){
  res.render('login', { title: 'Login'});
});

router.post('/login', function(req, res, next){
  var id = req.body.id;
  var password = req.body.password;
  var datas = [id, password];

  pool.getConnection(function(err, connection){
    var sqlForSelectStudent = "SELECT * FROM mydb.student_tbl WHERE stu_no=? AND stu_pwd=?";
    connection.query(sqlForSelectStudent, datas, function(err, rows){
      if(err) console.error("err : "+err);
      if(rows.length > 0){
        res.cookie("user", id, {
          expires: new Date(Date.now() + 900000),
          httpOnly: true
        });
        res.redirect('/main_home');
      }
      else {
        var sqlForSelectStudent = "SELECT * FROM mydb.professor_tbl WHERE pro_no=? AND pro_pwd=?";
        connection.query(sqlForSelectStudent, datas, function(err, rows){
          if(err) console.error("err : "+err);
          if(rows.length > 0){
            res.cookie("user", id, {
              expires: new Date(Date.now() + 900000),
              httpOnly: true
            });
            res.redirect('./main_home');
          }
          else {
            res.send("<script language=\"javascript\">alert('The ID does not exist or the password is incorrect!')</script>" + 
              "<script language=\"javascript\">window.location=\"/login\"</script>");
          }
        });
      }
      connection.release();
    });
  });
});

/* 로그인 성공 시 */

router.get('/main_home', function(req, res, next) {
  res.render('main_home', { title: 'main_home'});
});


/* 회원가임 폼 */
router.get('/signup', function(req, res, next){
  res.render('signup', {title: 'Sign Up'});
});

router.post('/signup', function(req, res, next){
  var id = req.body.id;
  var name = req.body.name;
  var password = req.body.password;
  var role = req.body.role;
  var datas = [id, name, password];

  pool.getConnection(function(err, connection){
    var sqlForInsert;
    if(role === 'student') {
      sqlForInsert = "INSERT INTO mydb.student_tbl (stu_no, stu_name, stu_pwd) VALUES (?, ?, ?)";
    } else if(role === 'professor') {
      sqlForInsert = "INSERT INTO mydb.professor_tbl (pro_no, pro_name, pro_pwd) VALUES (?, ?, ?)";
    } else {
      res.send('Invalid role');
      return;
    }
    connection.query(sqlForInsert, datas, function(err, rosw){
      if(err) console.error("err : "+err);
      res.redirect('/login');
      connection.release();
    });
  });
});

router.get('/noticeboard', function(req, res, next) {
  const userId = req.cookies.user;

  pool.getConnection(function(err, connection) {
    if (err) console.error("err : "+err);

    // Check if user is a student or a professor
    const checkUserRoleQuery = `
      (SELECT stu_no AS id FROM mydb.student_tbl WHERE stu_no = ?)
      UNION
      (SELECT pro_no AS id FROM mydb.professor_tbl WHERE pro_no = ?)
    `;

    connection.query(checkUserRoleQuery, [userId, userId], function(err, rows) {
      if (err) console.error("err : "+err);

      let fetchSubjectsQuery = '';
      let isProfessor = false;

      if (rows[0] && rows[0].id === userId) {  // User is a student
        fetchSubjectsQuery = 'SELECT * FROM mydb.board_tbl WHERE sub_code IN (SELECT sub_code FROM mydb.attend_tbl WHERE stu_no = ?)';
      } else if (rows[1] && rows[1].id === userId) {  // User is a professor
        fetchSubjectsQuery = 'SELECT * FROM mydb.board_tbl WHERE pro_no = ?';
        isProfessor = true;
      }

      connection.query(fetchSubjectsQuery, [userId], function(err, rows) {
        if (err) console.error("err : "+err);
        res.render('noticeboard', { title: 'Notice Board', subjects: rows, isProfessor: isProfessor });
        connection.release();
      });
    });
  });
});



router.get('/noticeboard/:bod_no', function(req, res, next) {
  const b_id = req.params.bod_no;

  pool.getConnection(function(err, connection) {
    if (err) console.error("err : "+err);

    const sql = 'SELECT * FROM mydb.board_tbl WHERE bod_no = ?';

    connection.query(sql, [b_id], function(err, rows) {
      if (err) console.error("err : "+err);
      res.render('noticeDetail', { title: 'Notice Detail', notice: rows[0] });
      connection.release();
    });
  });
});


router.get('/noticeboard/addNotice', function(req, res, next) {
  const userId = req.cookies.user;

  pool.getConnection(function(err, connection){
    if(err) console.error("err : "+err);

    const sql = 'SELECT * FROM mydb.subject_tbl WHERE pro_no = ?';

    connection.query(sql, [userId], function(err, rows){
      if(err) console.error("err : "+err);
      res.render('addNotice', {title : 'Add Notice', subjects: rows});
      connection.release();
    });
  });
});

router.post('/noticeboard/addNotice', function(req, res, next) {
  const userId = req.cookies.user;
  const {sub_code, bod_title, bod_content} = req.body;

  pool.getConnection(function(err, connection){
    if(err) console.error("err : "+err);
    
    const queryForProNo = 'SELECT pro_no FROM mydb.subject_tbl WHERE sub_code = ?';
    
    connection.query(queryForProNo, [sub_code], function(err, rows){
      if(err) console.error("err : "+err);
      
      const pro_no = rows[0].pro_no;
      
      const sql = 'INSERT INTO mydb.board_tbl (sub_code, pro_no, bod_title, bod_content, bod_regdate) VALUES (?, ?, ?, ?, NOW())';
      
      connection.query(sql, [sub_code, pro_no, bod_title, bod_content], function(err, result){
        if(err) console.error("err : "+err);
        console.log("Notice added : ", result);
        res.redirect('/noticeboard');
        connection.release();
      });
    });
  });
});

module.exports = router;
