
var express = require('express');
var router = express.Router();

const db = require('../models/index.js');


/* 임시메인 페이지 요청과 응답처리 라우팅 메소드 */
router.get('/', async(req, res, next)=>{
  res.render('index', { title: 'Express' });
});

/* 
- 관리자 웹사이트 로그인 웹페이지 요청과 응답처리 라우팅메소드
- 요청주소: http://localhost:5001/login
- 요청방식: Get
- 응답결과: login.ejs 뷰페이지 반환
*/
router.get('/login', async(req, res, next)=>{
  resultMsg = {
    code:200,
    msg:""
  }

  res.render('login.ejs',{layout: false, resultMsg});
});

/* 
- 관리자 로그인 정보처리 요청과 응답 라우팅메소드
- 요청주소: http://localhost:5001/login
- 요청방식: Post
- 응답결과: /main 페이지로 이동시킴
*/
router.post('/login', async(req, res, next)=>{
  resultMsg = {
    code:200,
    msg:""
  }

  const admin_id = req.body.admin_id;
  const admin_password = req.body.admin_password;

  const admin = await db.Admin.findOne({where:{admin_id}});

  if(admin){
      if(admin.admin_password == admin_password){
        //정상 로그인시 
        res.redirect('/main');
      }else{
        resultMsg.code = 402;
        resultMsg.msg = "비밀번호가 일치하지 않습니다."
        res.render('login.ejs',{layout:false, resultMsg})
      }
  }else{
      //아이디 또는 암호가 틀리면 다시 로그인페이지 반환
      resultMsg.code = 401;
      resultMsg.msg = "아이디가 일치하지 않습니다."
      res.render('login.ejs',{layout:false, resultMsg});
  }

});


/* 
- 관리자 웹사이트 메인 웹페이지 요청과 응답처리 라우팅메소드
- 요청주소: http://localhost:5001/main
- 요청방식: Get
- 응답결과: main.ejs 뷰페이지 반환
*/
router.get('/main', async(req, res)=> {
  res.render('main.ejs');
});




module.exports = router;
