//일반회원 정보처리를 위한 각종 요청과 응답처리 제공 라우터 파일

var express = require('express');
var router = express.Router();

//ORM db객체 참조
var db = require('../models/index.js');

/*
-신규 회원정보를 등록처리 요청과 응답 라우팅메소드
*/
router.post('/entry',async(req,res)=>{

    //백엔드 API를 호출하면 무조건 아래형식으로 데이터를 백엔드에서 반환
    let apiResult = {
        code:400, //요청상태코드 200:정상처리 400:요청리소스가 없을 때 500:서버개발자코딩에러
        data:null, //백엔드에서 프론트엔드로 전달한 데이터
        msg:""
    }

    try{
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;

        const member  = {
            email,
            member_password:password,
            name,
            profile_img_path:"/img/user22.png",
            entry_type_code:0,
            use_state_code:1,
            entry_data:Date.now()
        };

        let registedMember = await db.Member.create(member);
        registedMember.member_password = ""; //보안적이유로 암호는 프론트엔드에 전송안함.

        apiResult.code = 200;
        apiResult.data = registedMember;
        apiResult.msg = "Ok";

    }catch(err){

        console.log("/api/member/entry 호출에러발생:",err.message);

        //중요: 백엔드의 구체적인 에러내용을 프론트엔드로 전송하는 것은 보안적 위험을 제공함
        //DB등록처리시 먼저 DB서버를 연결하는데 DB연결실패하면 연결에러메시지를 제공하는데 이런정보내에 보안적으로 공유하면 안되는 정보들이 존재
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.msg = "Failed";        

    }

    res.json(apiResult);
});

module.exports = router;