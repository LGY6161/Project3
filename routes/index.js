var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'public/'});
var mysql = require('mysql2');
var pool = mysql.createPool({
  connectionLimit: 5,
  host:'localhost',
  user:'root',
  password: '123123',
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
    var sqlForSelectStudent = "SELECT * FROM mydb.student_tbl WHERE stu_no=? AND s_pwd=?";
    connection.query(sqlForSelectStudent, datas, function(err, rows){
      if(err) console.error("err : "+err);
      if(rows.length > 0){
        res.cookie("user", id, {
          expires: new Date(Date.now() + 900000),
          httpOnly: true
        });
        res.redirect('/login_success');
      }
      else {
        var sqlForSelectStudent = "SELECT * FROM mydb.professor_tbl WHERE pro_no=? AND p_psw=?";
        connection.query(sqlForSelectStudent, datas, function(err, rows){
          if(err) console.error("err : "+err);
          if(rows.length > 0){
            res.cookie("user", id, {
              expires: new Date(Date.now() + 900000),
              httpOnly: true
            });
            res.redirect('./login_success');
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
router.get('/login_success', function(req, res, next) {
  res.render('login_success', { title: 'Login Successful'});
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
      sqlForInsert = "INSERT INTO mydb.professor_tbl (pro_no, pro_name, pro_psw) VALUES (?, ?, ?)";
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

/* 강의 공지사항 */


/* 기본 로그인 페이지 */
module.exports = router;
