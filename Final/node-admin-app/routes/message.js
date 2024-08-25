var express = require('express');
var router = express.Router();

router.get('/list',async(req,res)=>{

    //게시글 데이터 목록 3개 생성-추후 DB에서 데이터를 가져옴
    const messages = [
        {
            msg_id:1,
            title:"게시글 제목1",
            contents:"게시글1 내용",
            display:1,
            view_cnt:1,
            ip_address:"111.111.111.111",
            regist_id:1,
            regist_date:Date.now()
        },
        {
            msg_id:2,
            title:"게시글 제목2",
            contents:"게시글1 내용",
            display:1,
            view_cnt:2,
            ip_address:"222.111.111.111",
            regist_id:2,
            regist_date:Date.now()
        },
        {
            msg_id:3,
            title:"게시글 제목3",
            contents:"게시글1 내용",
            display:1,
            view_cnt:3,
            ip_address:"211.111.111.111",
            regist_id:3,
            regist_date:Date.now()
        },        
    ];

    res.render('message/list', {messages});
});


module.exports = router;