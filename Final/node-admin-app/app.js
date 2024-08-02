var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();

//
var session = require('express-session'); 

//레이아웃 노드패키지 참조
var expressLayouts = require('express-ejs-layouts');
var sequelize = require('./models/index.js').sequelize;


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var memberRouter = require('./routes/member');
var channelRouter = require('./routes/channel');
var articleRouter = require('./routes/article');
var messageRouter = require('./routes/message');

var app = express();

sequelize.sync();

//백엔드 앱에서 세션을 사용할 수 있게 설정하기
app.use(
  session({
    resave: false, //매번 세션 강제 저장 옵션 로그인사이다 세션값이 변경이 없어도 강제로 저장할 지 여부
    saveUninitialized: true, //빈 세션도 저장할지 여부
    secret: "testsecret", //세션 아이디를 만들떄 사용한 암호화 키값
    cookie: {
      httpOnly: true,//http 지원여부
      secure: false,//http환경에서만 세션정보를 주고받도록 처리할지 여부
      maxAge: 1000 * 60 * 5 //5분동안 서버세션을 유지(1000은 1초), 보틍은 20분동안 유지되게 설정
    },
  }),
);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//모든 뷰파일에 적용되는 레이아우 뷰파일 설정
app.set('layout', 'layout'); //전체레이아웃 파일 지정
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);
app.set("layout extractMetas", true); 
app.use(expressLayouts);//노드앱에 레이아웃 기능 추가적용

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/member', memberRouter);
app.use('/channel', channelRouter);
app.use('/article', articleRouter);
app.use('/message', messageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
