const express = require("express");
const router = express.Router();

const db = require("../models/index");
const jwt = require('jsonwebtoken');

router.get("/list", async (req, res) => {
  let apiResult = {
    code: 200,
    data: null,
    msg: "",
  };

  try {
    const articleList = await db.Article.findAll();
    apiResult.code = 200;
    apiResult.data = articleList;
    apiResult.msg = "Ok";
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.msg = "관리자에 문의하세요";
  }

  res.json(apiResult);
});

router.post("/create", async (req, res) => {
  let apiResult = {
    code: 400,
    data: null,
    msg: "",
  };

  try {
    var token = req.headers.authorization.split(`Bearer `)[1];

    console.log("JWTtoken 출력:",token);

    var loginMember = await jwt.verify(token,process.env.JWT_AUTH_KEY);
    console.log("token 해석",loginMember);

    const article = {
      board_type_code: 2,
      title: req.body.title,
      article_type_code: 0,
      contents: req.body.contents,
      view_count: 0,
      ip_address: req.headers["x-forwarded-for"] || req.connection.remoteAddress, //로컬 개발환경인 경우 ::1 이렇게 ip주소가 추출됨,
      is_display_code: req.body.display,
      reg_date: Date.now(),
      reg_member_id: loginMember.member_id,
    };

    const registedArticle = await db.Article.create(article);

    apiResult.code = 200;
    apiResult.data = registedArticle;
    apiResult.msg = "Ok";
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.msg = "Failed";
  }

  res.json(apiResult);
});

router.get("/delelte", async (req, res) => {
  let apiResult = {
    code: 400,
    data: null,
    msg: "",
  };

  try {
  } catch (err) {}

  res.json(apiResult);
});

router.post("/modify/:id", async (req, res) => {
  let apiResult = {
    code: 400,
    data: null,
    msg: "",
  };

  try {
  } catch (err) {}

  res.json(apiResult);
});

router.get("/:id", async (req, res) => {
  let apiResult = {
    code: 400,
    data: null,
    msg: "",
  };

  try {
    const articleIdx = req.params.id;
    const article = await db.Article.findOne({
      where: { article_id: articleIdx },
    });

    apiResult.code = 200;
    apiResult.data = article;
    apiResult.msg = "Ok";
  } catch (err) {
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.msg = "Server Error....";
  }

  res.json(apiResult);
});

module.exports = router;
