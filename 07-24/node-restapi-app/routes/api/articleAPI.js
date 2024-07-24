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
                title:"게시글 제목",
                contents:"게시글1 내용",
                display:1,
                view_cnt:1,
                ip_address:"111.111.111.111",
                regist_id:1,
                regist_date:Date.now()
            },
            {
                article_id:2,
                title:"게시글 제목",
                contents:"게시글1 내용",
                display:2,
                view_cnt:1,
                ip_address:"111.111.111.111",
                regist_id:2,
                regist_date:Date.now()
            },
            {
                article_id:3,
                title:"게시글 제목",
                contents:"게시글1 내용",
                display:3,
                view_cnt:1,
                ip_address:"111.111.111.111",
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
    //restfull은 아래와 같이 처리하는게 좋음
    let apiResult = {
        code:200,
        data:null,
        result:""
    }

    try{
        //클라이언트에서 보내준 사용자 입력 json데이터를 추출
        //req.body.클라이언트에서 보내준 단일 게시글 json객체의 속성명
        const title = req.body.title;
        const contents = req.body.contents;
        const display = req.body.display;

        //사용자 json데이터를 DB 게시글 테이블에 저장
        const article = {
            title,
            contents,
            display,
            view_cnt:0,
            ip_address:"111.111.111.111",
            regist_id:1,
            regist_date:Date.now(),
        }

        apiResult.code = 200;
        apiResult.data = article;
        apiResult.result = "ok";


        //DB에 저장반환된 등록된 게시글 신규 게시글정보가 반환


    }catch(err){
        //try()블록스코프내에서 백엔드 에러가 발생하면 catch(err){} 블럭으로 에러내용 전달
        //에러내용을 외부 사람에게 보여주면 치명적일 수 있음
        //백엔드만 확인할 수 있게 하는게 좋음
        //에러내용에는 DB 계정에 대한 상세한 내용이 담길 수 있음
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "Server Error or 관리자에게 문의하세요."; //그래서 에러에 대한 내용이 아니 이런 메시지를 보통 전송함

    }

    //DB에 저장되고 반환된 단일게시글 정보를 클라이언트에 반환
    //HttpResponse객체의 json('json데이터')메소드는 서버에서 웹브라우저로 json데이터를 반환
        
    res.json(apiResult);
});

module.exports = router;