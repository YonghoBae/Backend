//users.js 라우터파일의 기본 호출주소체계는
//app.js에서 정의한 http://localhost:3000/users
var express = require('express');
var router = express.Router();

/* GET users listing. */
//http://localhost:3000/users/
router.get('/', function(req, res, next) {
  //해당 텍스트를 웹브라우저에 서버 응답결과물론 반환
  res.send('respond with a resource');
});

//http://localhost:3000/users/testing
router.get('/testing', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
