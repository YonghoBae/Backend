//articleAPI.js 라우터의 기본주소는 app.js에서 http://localhost:3000/api/article로 설정

var express = require('express');
var router = express.Router();


/*
-전체 게시글 목록 데이터 요청과 응답처리 라우팅메소드
-호출주소: http://localhost:3000/api/articles/list
-호출방식: Get
-응답결과: 게시글 JSON 데이터 목록
*/
router.get('/list',async(req,res)=>{
    let apiResult = {
        code:200,
        data:null,
        result:""
    }

    try{
        //DB 게시글 테이블에서 전체 게시글 목록을 가져왔다고 가정
        //가져온 데이터 예시
        const articles = [
            {
                article_id:1,
                title:"게시글 제목1",
                contents:"게시글1 내용",
                display:1,
                view_cnt:1,
                ip_address:"111.111.111.111",
                regist_id:1,
                regist_date:Date.now()
            },
            {
                article_id:2,
                title:"게시글 제목2",
                contents:"게시글1 내용",
                display:1,
                view_cnt:2,
                ip_address:"222.111.111.111",
                regist_id:2,
                regist_date:Date.now()
            },
            {
                article_id:3,
                title:"게시글 제목3",
                contents:"게시글1 내용",
                display:1,
                view_cnt:3,
                ip_address:"211.111.111.111",
                regist_id:3,
                regist_date:Date.now()
            },        
        ];

        apiResult.code = 200;
        apiResult.data = articles;
        apiResult.result = "ok";        
    }catch(err){
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "Failed Server Error 관리자에게 문의하십시오."
    }

    res.json(apiResult);
});


/*
-단일 신규 게시글 정보 등록 요청과 응답처리 라우팅메소드
-호출주소: http://localhost:3000/api/articles/list
-호출방식: Post
-응답결과: 등록처리완료된 단일게시글 정보 반환(여기는 게시글 번호있음)
*/
router.post('/create',async(req,res)=>{
    
    //API호출결과 표준 데이터 포맷 정의  
    let apiResult = {
        code:200,
        data:null,
        result:""
    };

    //백엔드 예외처리하기 
    try{

        //Step1: 클라이언트에서 보내준 사용자 입력 json데이터를 추출합니다.
        //req.body.클라이언트에서 보내준 단일 게시글 json객체의 속성명
        const title = req.body.title; //글제목
        const contents = req.body.contents; //글내용
        const display = req.body.display; //게시여부 

        //Step2: 사용자 json 데이터를 DB 게시글 테이블에 저장합니다.
        //DB 게시글 테이블에 저장할 JSON 단일 데이터 
        const article = {
            title:title,
            contents:contents,
            display:display,
            view_cnt:0,
            ip_address:"111.111.111.111",
            regist_id:1,
            regist_date:Date.now()
        }

        //DB 게시글 테이블에 상기 데이터를 저장한다.
        //저장하면 DB에 저장된 게시글 정보가 다시 반환됨(게시글 번호가 포함)
        //Step3: DB에 저장반환된 등록된 게시글 신규 게시글정보가 반환됩니다.
        const dbArticle ={
            article_id:1,
            title:title,
            contents:contents,
            display:display,
            view_cnt:0,
            ip_address:"111.111.111.111",
            regist_id:1,
            regist_date:Date.now()
        }

        apiResult.code = 200;
        apiResult.data = dbArticle;
        apiResult.result = "Ok";

    }catch(err){
        //try{}블록스코프내에서 백엔드 에러가 발생하면 catch(err){} 블럭으로 에러내용이 전달됩니다. 
        apiResult.code = 500;
        apiResult.data= null;
        apiResult.result = "Server Error or 관리자에게 문의하세요." 
    }

    //서버응답결과물로 순수 json데이터를 반환한다.
    //res.json(json데이터);
    res.json(apiResult);

});


/*
-기존 단일 게시글 정보 조회 요청과 응답처리 라우팅메소드
-호출주소: http://localhost:3000/api/articles/?aid=1
-호출방식: Get
-응답결과: 단일게시글 정보 JSON 반환
*/
router.get('/',async(req,res)=>{

    let apiResult = {
        code:200,
        data:null,
        result:""
    }

    try{

        //API URL 주소에서 게시글번호를 추출(쿼리스트링방식)
        //쿼리스트링방식으로 전달되는 키값을 req.query.키명으로 추출가능
        const articleIdx = req.query.aid;

        //해당 게시글번호를 기준으로 DB 게시글 테이블에서 단일게시글 정보를 조회
        //DB에서 조회해온 단일 게시글 정보라고 가정
        const article = {
            article_id:1,
            title:"게시글 제목1",
            contents:"게시글1 내용",
            display:1,
            view_cnt:1,
            ip_address:"111.111.111.111",
            regist_id:1,
            regist_date:Date.now()
        };

        apiResult.code = 200;
        apiResult.data = article;
        apiResult.result = "Ok";

    }catch(err){

        console.log("실제 서버에러 확인하기:",err.messages);
        //백엔드에서 에러가 난 사실을 서버에 물리적 로그폴더를 만들고 로그.txt(.log)파일에 기록하면
        //좀 더 적극적으로 서버에러에 대한 대응이 가능

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "서버에러발생, 관리자에게 문의하세요";
    }

    //단일게시글 정보를 웹브라우저/클라이언트 응답결과물로 반환
    res.json(apiResult);
});

/*
-기존 단일 게시글 정보 조회 요청과 응답처리 라우팅메소드
-호출주소: http://localhost:3000/api/articles/?aid=1
-호출방식: Get
-응답결과: 단일게시글 정보 JSON 반환
*/
router.get('/:aid',async(req,res)=>{

    let apiResult = {
        code:200,
        data:null,
        result:""
    }

    try{

        //API URL 주소에서 게시글번호를 추출(쿼리스트링방식)
        //파라메터 방식으로 전달되는 키값을 와일드카드로 추출가능
        const articleIdx = req.params.aid;

        //해당 게시글번호를 기준으로 DB 게시글 테이블에서 단일게시글 정보를 조회
        //DB에서 조회해온 단일 게시글 정보라고 가정
        const article = {
            article_id:1,
            title:"게시글 제목1-파라매터 방식",
            contents:"게시글1 내용",
            display:1,
            view_cnt:1,
            ip_address:"111.111.111.111",
            regist_id:1,
            regist_date:Date.now()
        };

        apiResult.code = 200;
        apiResult.data = article;
        apiResult.result = "Ok";

    }catch(err){

        console.log("실제 서버에러 확인하기:",err.messages);
        //백엔드에서 에러가 난 사실을 서버에 물리적 로그폴더를 만들고 로그.txt(.log)파일에 기록하면
        //좀 더 적극적으로 서버에러에 대한 대응이 가능

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "서버에러발생, 관리자에게 문의하세요";
    }

    //단일게시글 정보를 웹브라우저/클라이언트 응답결과물로 반환
    res.json(apiResult);
});

/*
-기존 단일 게시글 수정 처리 요청과 응답 라우팅메소드
-호출주소: http://localhost:3000/api/articles/modify
-호출방식: Post
-응답결과: 수정결과 JSON 반환
*/
router.post('/modify',async(req,res)=>{

    //API호출결과 표준 데이터 포맷 정의  
    let apiResult = {
        code:200,
        data:null,
        result:""
    };

    //백엔드 예외처리하기 
    try{

        //Step1: 클라이언트에서 보내준 사용자 입력 json데이터를 추출합니다.
        //req.body.클라이언트에서 보내준 단일 게시글 json객체의 속성명
        const article_id = req.body.article_id; //수정하려는 게시글 고유번호
        const title = req.body.title; //글제목
        const contents = req.body.contents; //글내용
        const display = req.body.display; //게시여부 

        //Step2: 사용자 json 데이터를 DB 게시글 테이블에 수정합니다.
        //DB 게시글 테이블에 저장할 JSON 단일 데이터 
        const article = {
            title:title,
            contents:contents,
            display:display,
            ip_address:"111.111.111.111",
            regist_id:1,
            regist_date:Date.now()
        }

        //DB 게시글 테이블에 상기 데이터를 수정한다.
        //수정하면 DB에 수정된 건수를 반환
        //Step3: 수정된 건수를 data값으로 지정해주고 프론트에 수정된 건수를 전달

        apiResult.code = 200;
        apiResult.data = 1; //실제 db서버에서 제공된 수정적용건수
        apiResult.result = "Ok";

    }catch(err){
        //try{}블록스코프내에서 백엔드 에러가 발생하면 catch(err){} 블럭으로 에러내용이 전달됩니다. 
        apiResult.code = 500;
        apiResult.data= null;
        apiResult.result = "Server Error or 관리자에게 문의하세요." 
    }

    //서버응답결과물로 순수 json데이터를 반환한다.
    //res.json(json데이터);
    res.json(apiResult);

});


/*
-기존 단일 게시글 삭제 처리 요청과 응답 라우팅메소드
-호출주소: http://localhost:3000/api/articles/delete?aid=1
-호출방식: Get
-응답결과: 수정결과 JSON 반환
*/
router.get('/delete',async(req,res)=>{
    let apiResult = {
        code:200,
        data:null,
        result:""
    };

    try{
        //URL에서 삭제할려는 게시글 번호를 조회
        const articleIdx = req.query.aid;

        //DB테이블에서 해당 게시글을 삭제처리

        //DB서버에서 특정 데이터가 삭제되면 삭제건수가 백엔드로 반환
        const deletedCount = 1; //삭제 건수 1로 가정

        apiResult.code = 200;
        apiResult.data = deletedCount;
        apiResult.result = "Ok";

    }catch(err){

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "";

    }

    res.json(apiResult);
});

module.exports = router;