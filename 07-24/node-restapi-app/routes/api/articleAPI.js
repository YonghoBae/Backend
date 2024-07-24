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

    res.json(articles);
});

module.exports = router;