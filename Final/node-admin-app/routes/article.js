var express = require('express');
var router = express.Router();

//DB프로그래밍을 위한 ORM DB객체 참조
var db = require('../models/index');
const article = require('../models/article');

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
    

//게시글 전체목록조회 웹페이지 요청과 응답처리 라우팅메소드
router.get('/list',async(req,res)=>{

    const articles = await db.Article.findAll();

    res.render('article/list',{articles});
});

//신규 게시글 등록 웹페이지 요청과 응답처리 라우팅메소드
router.get('/create',async(req,res)=>{
    res.render('article/create');
});

//신규 게시글 입력정보 등록처리 요청과 응답처리 라우팅메소드
router.post('/create', upload.single('file'),async(req,res)=>{
    //신규 게시글 등록폼에서 사용자가 입력/선택한 값을 추출
    const title = req.body.title;
    const contents = req.body.contents;
    const display_code = req.body.display;

    //첨부파일이 있는 경우 파일정보 추출
    //폼에서 file태그에 파일을 첨부하면 req.file이라는 속성으로
    //서버에 업로드된 파일정보를 추출할 수 있음
    const uploadFile = req.file;

    //article 테이블에 등록할 데이터 json 데이터 생성
    //반드시 JSON 데이터 속성명은 article.js 모델의 속성명과 일치해야함
    const article = {
        board_type_code:1,
        title,
        article_type_code:0,
        contents,
        view_count:0,
        ip_address:'123.111.111.111',
        is_display_code:display_code,
        reg_date:Date.now(),
        reg_member_id:1
    }

    //준비된 신규 게시글 데이터를 article테이블에 저장한다.
    //create()메소드는 ORM Framework의해 INSERT INTO article()values()쿼리로 변환되어
    //DB서버에 전송되어 DB서버에서 실행되고 실제 저장된 단일게시글 DATA를 DB서버에서 반환
    const registedArticle = await db.Article.create(article);
    console.log("실제 DB article 테이블에 저장된 데이터확인",registedArticle)

    if(uploadFile){
        //실제 서버에 업로드된 파일경로
        const filePath = `/upload/${uploadFile.filename}`;
        const fileName = uploadFile.filename; //서버에 업로드된 파일명( ex> 1242534534_a.png)
        const originalFileName = uploadFile.originalname;//사용자가 업로드한 파일명( ex> a.png)
        const fileSize = uploadFile.size;//파일크기
        const mimeType = uploadFile.mimetype;//파일의 MIME타입

        //파일정보를 DB에 저장
        const file = {
            article_id:registedArticle.article_id,
            file_name:fileName,
            file_size:fileSize,
            file_path:filePath,
            file_type:mimeType,
            reg_date:Date.now(),
            reg_member_id:1
        }

        //file첨부데이터를 article_file테이블에 저장
        await db.ArticleFile.create(file);
    }

    res.redirect('/article/list');
});



//기존 단일 게시글 수정처리 요청과 응답처리 라우팅메소드
router.post('/modify', async(req,res)=>{
    //게시글 고유번호 추출
    const articleIdx = req.body.article_id; //히든 태그로 추출

    //수정할 JSON 데이터 생성
    //수정할 컬럼과 값만 지정하고 컬럼의 속성은 article.js 모델의 속성명과 일치해야함
    const article = {
        title:req.body.title,
        contents:req.body.contents,
        is_display_code:req.body.display,
        ip_address:'222.222.222.222',
        edit_date:Date.now(),
        edit_member_id:1
    }

    //수정된 데이터 건수 결과값으로 전달
    const updateCnt = await db.Article.update(article,{where:{article_id:articleIdx}});

    res.redirect('/article/list');
});

//기존 단일 게시글 삭제처리 요청과 응답처리 라우팅메소드
router.get('/delete', async(req,res)=>{

    const articleIdx = req.query.id;

    const deleteCnt = await db.Article.destroy({where:{article_id:articleIdx}});

    res.redirect('/article/list');
});


//기존 단일 게시글 정보 조회 확인 웹페이지 요청과 응답처리 라우팅메소드
router.get('/modify/:id',async(req,res)=>{

    var articleIdx = req.params.id;

    const article = await db.Article.findOne({where:{article_id:articleIdx}});

    const articleFile = await db.ArticleFile.findOne({where:{article_id:articleIdx}});

    res.render('article/modify',{article, articleFile});
});

module.exports = router;