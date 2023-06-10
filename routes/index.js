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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
    var sqlForSelectStudent = "SELECT * FROM mydb.student WHERE s_no=? AND s_pwd=?";
    connection.query(sqlForSelectStudent, datas, function(err, rows){
      if(err) console.error("err : "+err);
      if(rows.length > 0){
        res.cookie("user", id, {
          expires: new Date(Date.now() + 900000),
          httpOnly: true
        });
        res.redirect('/student_main');
      }
      else {
        var sqlForSelectStudent = "SELECT * FROM mydb.professor WHERE p_no=? AND p_psw=?";
        connection.query(sqlForSelectStudent, datas, function(err, rows){
          if(err) console.error("err : "+err);
          if(rows.length > 0){
            res.cookie("user", id, {
              expires: new Date(Date.now() + 900000),
              httpOnly: true
            });
            res.redirect('./professor_main');
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
      sqlForInsert = "INSERT INTO mydb.student (s_no, s_name, s_pwd) VALUES (?, ?, ?)";
    } else if(role === 'professor') {
      sqlForInsert = "INSERT INTO mydb.professor (p_no, p_name, p_psw) VALUES (?, ?, ?)";
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



module.exports = router;
