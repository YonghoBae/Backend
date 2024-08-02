//localhost:5001/admin 주소는 app.js에서 설정

var express = require('express');
var router = express.Router();

var db = require('../models/index.js');
//동적SQL쿼리를 직접 작성해서 전달하기 위한 참조
var sequelize = db.sequelize;
const {QueryTypes} = sequelize;

var moment = require('moment');
//관리자 암호를 단방향암호화(해시알고리즘)을 이용하여
var bcrypt = require('bcryptjs');

//관리자 로그인여부 체크 미들웨어 함수 참조
const {isLoggined} = require('./sessionMiddleware.js');

/*
- 관리자 계정 목록 조회 웹페이지 요청과 응답처리 라우팅메소드
- http://localhost:5001/admin/list
- 관리자 계정 전체 목록 조회 웹페이지 반환
*/
router.get('/list', isLoggined, async(req,res)=>{
    const company_code = req.body.company_code;
    const admin_id = req.body.admin_id;
    const used_yn_code = req.body.used_yn_code;

    const searchOption = {
        company_code:"9",
        admin_id:"",
        use_yn_code:"9"
    }

    let query = `SELECT
        admin_member_id,
        admin_id,
        admin_name,
        email,
        company_code,
        dept_name,
        used_yn_code,
        reg_date
    FROM admin_app.admin
    WHERE used_yn_code = 1 `;

    if(company_code != 9){
        query += ` AND company_code = ${company_code} `;
    }


    if(admin_id > 0){
        query += ` AND admin_id Like '%${admin_id}%' `;
    }


    if(used_yn_code != 9){
        query += ` AND used_yn_code = ${used_yn_code} `;
    }

    query += `ORDER BY reg_date DESC`;

    //전체 관리자 계정목록 조회하기
    //ORM 내부적으로 자동생성해서 db서버에 전달/실행되고 그 결과물이 백엔드로 반환
    const admins = await db.Admin.findAll();



    res.render('admin/list', {admins, moment, searchOption});
});

/*
- 관리자 계정 목록 조회처리 웹페이지 요청과 응답처리 라우팅메소드
- http://localhost:5001/admin/list
- 관리자 조회옵션에 해당하는 결과 웹페이지 반환
*/
router.post('/list', isLoggined,async(req,res)=>{

    const company_code = req.body.company_code;
    const admin_id = req.body.admin_id;
    const use_yn_code = req.body.use_yn_code;

    const admins = await db.Admin.findAll({where:{admin_id:admin_id}});

    const searchOption = {
        company_code,
        admin_id,
        use_yn_code
    }

    res.render('admin/list',{admins,moment,searchOption});
});

/*
- 신규 관리자 계정 등록 웹페이지 요청과 응답처리 라우팅메소드
- http://localhost:5001/admin/create
- 신규 관리자 계정 등록 웹페이지 반환
*/
router.get('/create', isLoggined,async(req,res)=>{
    res.render('admin/create');
});

/*
- 신규 관리자 계정 등록처리 웹페이지 요청과 응답처리 라우팅메소드
- http://localhost:5001/admin/create
- 신규 관리자 계정 등록 처리 후 목록페이지 이동
*/
router.post('/create', isLoggined,async(req,res)=>{

    const admin_password = req.body.admin_password;
    //hash('사용자가 입력한 암호',암호화강도);
    //암호화강도 -> 해쉬를 몇번 돌릴건지
    const encryptedPassword = await bcrypt.hash(admin_password,12);

    const loginAdminId = req.session.loginUser.admin_member_id;

    const admin = {
        admin_id:req.body.admin_id,
        admin_password:encryptedPassword,
        admin_name:req.body.admin_name,
        summary:req.body.summary,
        email:req.body.email,
        company_code:req.body.company_code,
        dept_name:req.body.dept_name,
        telephone:req.body.telephone,
        used_yn_code:req.body.used_yn_code,
        reg_member_id:loginAdminId,
        reg_date:Date.now()
    };

    const registedAdmin = await db.Admin.create(admin);

    res.redirect('/admin/list');
});


/*
- 기존 관리자 계정 정보 수정 처리 요청과 응답처리 라우팅메소드
- http://localhost:5001/admin/modify/1
- 기존 관리자 계정 정보 수정 처리 후 목록페이지 이동
*/
router.post('/modify', isLoggined,async(req,res)=>{
    const admin_member_id = req.body.admin_member_id;

    const admin = {
        admin_name:req.body.admin_name,
        summary:req.body.summary,
        email:req.body.email,
        company_code:req.body.company_code,
        dept_name:req.body.dept_name,
        telephone:req.body.telephone,
        used_yn_code:req.body.used_yn_code,
        edit_member_id:1,
        edit_date:Date.now()
    };

    const modifiedAdmin = await db.Admin.update(admin,{where:{admin_member_id}});


    res.redirect('/admin/list');
});

/*
- 기존 관리자 계정 삭제 처리 요청과 응답처리 라우팅메소드
- http://localhost:5001/admin/modify/1
- 기존 관리자 계정 삭제 처리 후 목록페이지 이동
*/
router.get('/delete', isLoggined,async(req,res)=>{
    const admin_member_id = req.query.id;

    const deletedAdmin = await db.Admin.destroy({where:{admin_member_id}});

    res.redirect("/admin/list")
});


/*
- 기존 관리자 계정 확인 웹페이지 요청과 응답처리 라우팅메소드
- http://localhost:5001/admin/modify/1
- 기존 관리자 계정 정보 확인 웹페이지 반환
*/
router.get('/modify/:aid', isLoggined,async(req,res)=>{
    const admin_member_id = req.params.aid;
    
    const admin = await db.Admin.findOne({where:{admin_member_id}});

    res.render('admin/modify',{admin});
});



module.exports = router;