var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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
