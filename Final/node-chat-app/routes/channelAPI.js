const express = require("express");
const router = express.Router();

const db = require("../models/index");
const jwt = require("jsonwebtoken");

router.get("/list", async (req, res) => {
  let apiResult = {
    code: 200,
    data: null,
    msg: "",
  };

  try {
    const channelList = await db.Channel.findAll();
    apiResult.code = 200;
    apiResult.data = channelList;
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

    console.log("JWTtoken 출력:", token);

    var loginMember = await jwt.verify(token, process.env.JWT_AUTH_KEY);
    console.log("token 해석", loginMember);

    const channel = {
      community_id: 1,
      category_code: 2,
      channel_name: req.body.channel_name,
      user_limit: req.body.user_limit,
      channel_state_code: req.body.channel_state_code,
      reg_date: Date.now(),
      reg_member_id: loginMember.member_id,
    };

    const registedChannel = await db.Channel.create(channel);

    apiResult.code = 200;
    apiResult.data = registedChannel;
    apiResult.msg = "Ok";
  } catch (err) {
    console.log(err);
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.msg = "Failed";
  }

  res.json(apiResult);
});

module.exports = router;
