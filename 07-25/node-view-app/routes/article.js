var express = require('express');
var router = express.Router();

router.get('/list',async(req,res)=>{

    //게시글 데이터 목록 3개 생성-추후 DB에서 데이터를 가져옴
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

    res.render('article/list', {articles});
});

router.get('/create',async(req,res)=>{
    res.render('article/create');
});

router.post('/create',async(req,res)=>{
    const title = req.body.title;
    const contents = req.body.contents;
    const display = req.body.display;

    const article = {
        title,
        contents,
        display,
        ip_address:"222.222.222.222",
        view_cnt:10,
        regist_id:1,
        regist_date:Date.now()
    };

    //DB서버에서 insert SQL구문을 통해서 DB등록처리가 되면 등록된 실제 데이터셋을 다시 반환함
    const registArticle = {
        article_id:1,
        title,
        contents,
        display,
        ip_address:"222.222.222.222",
        view_cnt:10,
        regist_id:1,
        regist_date:Date.now()
    };
    
    res.redirect('/article/list');
});

router.post('/modify',async(req,res)=>{
    const articleIdx = req.body.article_id;

    const article = {
        title:req.body.title,
        contents:req.body.contents,
        display:req.body.display,
        modify_id:1,
        modify_date:Date.now()
    };

    res.redirect('/article/list');
});

router.get('/modify/:aid',async(req,res)=>{

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

    res.render('article/modify',{article});
});

router.get('/delete',async(req,res)=>{
    const articleIdx = req.query.aid;

    res.redirect("/article/list")
});


module.exports = router;