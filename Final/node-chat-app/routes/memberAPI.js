//일반회원 정보처리를 위한 각종 요청과 응답처리 제공 라우터 파일

var express = require('express');
var router = express.Router();

//사용자 암호 단방향 암호화 적용을 위해 encryptjs 참조
var encrypt = require('bcryptjs');

//JWT 토큰 생성을 위한 jsonwebtoken 패키지 참조
var jwt = require('jsonwebtoken');

//ORM db객체 참조
var db = require('../models/index.js');

//파일업로드를 위한 multer객체 참조
var multer = require('multer');

//파일저장위치 지정
var storage = multer.diskStorage({ 
    destination(req, file, cb) {
        cb(null, 'public/upload/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}__${file.originalname}`);
    },
});

var upload = multer({ storage: storage });

/*
-신규 회원정보를 등록처리 요청과 응답 라우팅메소드
-신규 회원 정보 등록처리 후 DB에 저장된 회원정보 반환
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

        const existMember = await db.Member.findOne({where:{email}});

        if(existMember){
            apiResult.code = 400;
            apiResult.data = null;
            apiResult.msg = "ExistMember";
            return res.json(apiResult);
        }

        const encryptedPassword = await encrypt.hash(password,12);

        const member  = {
            email,
            member_password:encryptedPassword,
            name,
            profile_img_path:"/img/user22.png",
            entry_type_code:0,
            use_state_code:1,
            entry_date:Date.now()
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

/*
-회원 로그인 데이터 처리 요청과 응답 라우팅메소드
-사용자 메일/암호를 체크하고 JWT 사용자 인증토큰값을 프론트엔드로 반환
*/
router.post('/login',async(req,res)=>{
    
    let apiResult = {
        code:400,
        data:null,
        msg:""
    };

    try{
        const email = req.body.email;
        const password = req.body.password;

        const member = await db.Member.findOne({where:{email}});

        if(member){
            const compareResult = await encrypt.compare(password,member.member_password);

            if(compareResult){
                //사용자 메일주소/암호가 일치할 경우 현재 로그인 사용자의 주요정보를 JSON데이터화
                const tokenJsonData = {
                    member_id:member.member_id,
                    email:member.email,
                    name:member.name,
                    profile_img_path:member.profile_img_path,
                }

                //인증된 사용자 JSON데이터를 JWT토큰내에 댐아 JWT 토큰문자열을 생성
                //jwt.sing('토큰에 저장할 JOSN데이터',토큰화할때 사용하는 인증키값,옵션값(토큰유효기간설정,발급자));
                const token = await jwt.sign(tokenJsonData,process.env.JWT_AUTH_KEY,{
                    expiresIn:'24h',
                    issuer:"BYH"
                });

                apiResult.code = 200;
                apiResult.data = token;
                apiResult.msg = "Ok";
            }else{
                apiResult.code = 402;
                apiResult.data = null;
                apiResult.msg = "InCorrectPassword";
            }
        }else{
            apiResult.code = 401;
            apiResult.data = null;
            apiResult.msg = "NotExistEmail";
        }

    }catch(err){
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.msg = "Failed";
    }

    res.json(apiResult);
});


/*
-현재 로그인한 사용자의 상세 프로필 정보를 DB에서 조회하여 반환하는 라우팅메소도
-프론트엔드에서 제공한 JWT토큰값을 전달받아 해당 사용자 메일주소로 DB에서 조회한 결과값 반환
*/
router.get('/profile',async(req,res)=>{

    let apiResult = {
        code:400,
        data:null,
        msg:""
    };

    try{
        //웹브라우저에서 JWT토큰값 추출
        //웹브라우저에서 전달되는 토큰값 예시: "Bearer 토큰값"
        var token = req.headers.authorization.split('Bearer ')[1];

        //JWT 토큰 문자열내에서 인증사용자 JSON 데이터를 추출
        //jwt.verify('토큰문자열',토큰생성시사용한 인증키값); 실행후 토큰내 저장된 JOSN 데이터를 반환
        var loginMemberData = await jwt.verify(token,process.env.JWT_AUTH_KEY);
        
        //토큰 페이로드 영역에서 추출한 현재 로그인 사용자 고유번호를 기준으로 DB에서 단일사용자 조회
        var dbMember = await db.Member.findOne({
            where:{member_id:loginMemberData.member_id}
        });

        dbMember.member_password = "";
        
        //단일 사용자 정보를 프론트엔드로 전달
        apiResult.code = 200;
        apiResult.data = dbMember;
        apiResult.msg = "Ok";

    }catch(err){
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.msg = "Server Error";
    }

    res.json(apiResult);
});


/*
- 사용자 프로필 사진 업로드 및 정보 처리 라우팅메소드
- 호출주소: http://localhost:5000/api/member/profile/upload
- 호출방식: Post
- 응답결과: 프론트엔드에서 첨부한 이미지 파일을 업로드 처리하고 업로드된 정보를 반환한다.
*/
router.post("/profile/upload", upload.single('file'), async(req, res) => {
    let apiResult = {
      code: 400, //요청상태코드: 200:정상처리 400:요청리소스가 없을때 500:서버개발자코딩에러
      data: null, //백엔드에서 프론트엔드로 전달한 데이터
      msg: "", //처리결과 코멘트(백엔드개발자가 프론트엔드 개발자에게 알려주는 코멘트메시지)
    };
  
    try {
      // Step1: 업로드된 파일 정보 추출하기
      const uploadFile = req.file;
  
      if (uploadFile) {
        const filePath = `/upload/${uploadFile.filename}`;
        const fileName = uploadFile.filename; // 서버에 업로드된 파일명
        const originalFileName = uploadFile.originalname; // 사용자가 업로드한 파일명 (a.png)
        const fileSize = uploadFile.size;
        const mimeType = uploadFile.mimetype;
    
        const file = {
          file_name: fileName,
          file_path: filePath,
          file_size: fileSize,
          file_type: mimeType,
        };
  
        // Step2: 업로드된 파일 정보 반환하기
        apiResult.code = 200;
        apiResult.data = file;
        apiResult.msg = "Ok";
      }
  
      
    } catch (error) {
      apiResult.code = 500;
      apiResult.data = null;
      apiResult.msg = "Server Error!";
    }
  
    res.json(apiResult);
});

module.exports = router;