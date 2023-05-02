/**********************************************
 * 기본세팅
 **********************************************/
const express = require('express')
const app = express()
const port = 3000;
const multer = require('multer');
const history = require('connect-history-api-fallback');
const bodyParser = require('body-parser')
const USER = require('./user/index')
app.use(history())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${new Date().toISOString().replace(/:/g, '-')}`);
  }
});
const upload = multer({ storage: storage });
/**********************************************
 * Routes
 **********************************************/
app.use('/api/user', USER)    //user 관련


/**********************************************
 * 기타
 **********************************************/


app.get('*', (req, res) => {
  res.end('hello')
})
/**********************************************
 * start
 **********************************************/
app.listen(port, () => {
  console.log('서버실행', port);
})