express = require("express");
router = express.Router();

const db = require("../models/index");

router.get("/list", async (req, res) => {
  let apiResult = {
    code: 200,
    data: null,
    msg: "",
  };

  try {
    const articleList = await db.Artilce.findAll();
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
