var express = require('express');
var router = express.Router();

/* 
메인 웹페이지 요청과 응답처리 라우팅 메소드 
호출주소: https://localhost:3000/
*/
router.get('/', function(req, res, next) {
  //서버에서 사용자 웹브라우저로 응답결과물을 반환
  //지정된 뷰파일내 웹페이지가 반환
  //res.render('');
  res.render('index', { title: 'Express' });
});

module.exports = router;
