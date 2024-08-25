var express = require('express');
var router = express.Router();

//공용 기능 미들웨어 참조
//middleware.js모듈에서 제공하는 2개의 미들웨어 함수
const {checkParams,checkQuery} = require('./middleware');

//해당 라우터파일이 호출되면 무조건 실행되는 미들웨어 함수정의하
router.use(function(req,res,next){
  console.log("Index.js라우터 파일이 호출될때마다 실행되는 기능구현");
  next();
});

router.use('/sample',function(req,res,next){
  console.log("Index.js 라우터 파일 미들웨어2호출", req.originalUrl);
  next();
},function(req,res,next){
  console.log("Index.js 라우터 파일 미들웨어3호출", req.method);
  res.send(req.method);
});

/* 
-메인 웹페이지 요청과 응답처리 라우팅메소드 
-호출주소: http://localhost:3000/
-호출방식: Get
-응답결과: views/index.ejs 뷰파일 웹페이지 내용 응답결과로 제공
*/

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//checkParams 미들웨어를 요청이후 응답전에 먼저 실행하게하여 특정로직을 태움
//router.get에서 메소드 실행->checkParams()미들웨어함수실행 -> 응답콜백함수실행
router.get('/test/:id',checkParams,async(req,res,next)=>{
  res.render('index',{title: "테스트"});
});

//
router.get('/product',checkQuery,async(req,res,next)=>{
  res.render('index',{title: "테스트"});
});

module.exports = router;
