
var express = require('express');
var router = express.Router();

const db = require('../models/index.js');

var bcrypt = require('bcryptjs');


/* 임시메인 페이지 요청과 응답처리 라우팅 메소드 */
router.get('/', async(req, res, next)=>{
  res.redirect('/main');
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
      //bcrypt.compare('로그인화면에서 전달된 암호',db에 저장된 암호화된 문자열) 메소드는 암호가 같으면 true반환
      if(await bcrypt.compare(admin_password,admin.admin_password)){

        //서버세션에 저장할 유저의 주요 정보 설정
        var sessionLoginData = {
          admin_member_id:admin.admin_member_id,
          company_code:admin.company_code,
          admin_id:admin.admin_id,
          admin_name:admin.admin_name
        };

        //express-session 패키지를 설치하고 app.js에 설정하면 req객체에 session속성이 추가
        //req.session속성에 loginUser 동적속성을 정의하고 값으로
        //현재 로그인한 사용자의 주요 데이터를 저장
        req.session.loginUser = sessionLoginData;

        //현재 사용자의 로그인 여부를 동적속성 isLogined를 정의하고 값으로 true를 설정
        req.session.isLogind = true;  

        //서버세션을 최종 저장하고 메인페이지로 이동
        req.session.save(function(){
          console.log('세션에 저장완료',req.session.isLogind);
          res.redirect('/main');
        });

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
