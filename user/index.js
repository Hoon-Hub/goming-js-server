const express = require('express');
const router = express.Router();
const db = require('../db.js')
const bcrypt = require('bcrypt')

router.get('/', (req,res) => {
  res.end('user')
})

//이메일중복확인
router.post('/duplicateCheck', async (req,res) => {
  const {eml} = req.body
  const sql = `SELECT COUNT(eml) as COUNT FROM user WHERE eml = '${eml}'`
  await db.execute(sql, function (err, results, fields) {
      const duplicateCheck = results[0].COUNT;
      const result = {}
      if (duplicateCheck == 0) { // 중복x
        result["resultCode"] = "00"
        result["resultEml"] = eml
        result["resultMsg"] = "사용하실 수 있는 아이디입니다."
      } else { // 중복o
        result["resultCode"] = "99"
        result["resultEml"] = eml
        result["resultMsg"] = "이미 존재하는 아이디입니다."
      }

      err ? res.status(500).send(err) : res.status(200).send(result)
    })  
})

//회원가입
router.post('/insertUser', async (req,res) => {
  const {eml, usrNm, password, gndrClsCd, brdt} = req.body
  const sql = `SELECT COUNT(eml) as COUNT FROM user WHERE eml = '${eml}'`
  await db.execute(sql, function (err, results, fields) {
    const saltRounds = 10;
    const duplicateCheck = results[0].COUNT;
    const result = {}
    
    if (duplicateCheck == 0) { // 중복x
      const encryptedPassword = bcrypt.hashSync(password, saltRounds);

      const sql2 = `INSERT INTO user(eml,usr_nm,password,gndr_cls_cd,brdt,join_dtm) VALUES('${eml}','${usrNm}', '${encryptedPassword}','${gndrClsCd}','${brdt}',now())`

      //회원가입
      db.execute(sql2, function (err, results, fields) {
        console.log(results)
        if ( results["affectedRows"] === 1 ) {
          result["resultCode"] = "00"
          result["resultEml"] = eml
          result["resultMsg"] = "아이디생성 성공"
        } else {
          result["resultCode"] = "99"
          result["resultEml"] = eml
          result["resultMsg"] = "아이디생성에 실패하였습니다."
        }
        err ? res.status(500).send(err) : res.status(200).send(result)
      });

    } else { // 중복o
      result["resultCode"] = "99"
      result["resultEml"] = eml
      result["resultMsg"] = "이미 존재하는 아이디입니다."
      res.status(200).send(result);
    }
    err && res.status(500).send(err);

  })  
})

//로그인
module.exports = router;