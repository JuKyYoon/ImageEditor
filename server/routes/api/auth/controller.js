const jwt = require("jsonwebtoken");
const {Database, pool} = require('../../../database/index');
const secretObj = require('../../../config/jwt');
const crypto = require('crypto');

/**
 * 아이디 중복 체크
 * @param {HttpRequest} req 
 * @param {HttpResponse} res 
 */
exports.dupCheck = (req, res) => {
  const {id} = req.body;
  const params = [id]
  let query = `SELECT EXISTS (SELECT * FROM USERS WHERE userid = "?") as success`;

  // 실패 핸들러
  const onError = (error) => {
    res.status(500).json({
      msg: error.message
    })
  }

  // 성공 핸들러
  const respond = ({connection, result}) => {
    if(result[0].success) {
      res.status(200).json({
        msg: 'exist'
      })
    }
    else {
      res.status(200).json({
        msg: 'not exist'
      })
    }

    new Promise((resolve) => {
      connection.release();
      resolve();
    })
    .then(() => {
      console.log("MySQL pool released: threadId " + connection.threadId);
    })
  }

  const check = (conn) => {
    pool.safeQuery(conn, query, params)
    .then(respond)
    .catch(onError)
  }
    
  pool.connect()
   .then(check)
   .catch(onError)
}

/**
 * 로그인
 * @param {HttpRequest} req 
 * @param {HttpResponse} res 
 */
exports.login = (req, res) => {
  const { id, password } = req.body;
  const params = [id];
  let query = `SELECT password, salt FROM USERS WHERE userid = ?;`;

  if(!id || !password) {
    res.status(400).json({
      msg: "no id or no password"
    })
    return;
  }

  // DB에서 유저 정보 가져온다.
  const getUserData = ({connection, result}) => {
    if(result.length === 1) {
      let dbPassword = result[0].password;
      let salt = result[0].salt;
      
      return new Promise((resolve) => {
        connection.release();
        console.log("MySQL pool released: threadId " + connection.threadId);
        resolve({dbPassword, salt});
      })
    } else {
      throw new Error('wrong id');
    }
  }

  // 가져온 유저 비밀번호를 이용해 체크하고, JWT을 생성한다.
  const genAccessToken = (data) => {
    let hashPassword = crypto.pbkdf2Sync(password, data.salt, 100000, 64, 'sha512').toString('base64');
    if(data.dbPassword === hashPassword) {
      return new Promise((resolve, reject) => {
        jwt.sign(
          {
            user_id: id
          },
          secretObj.secret,
          {
            expiresIn: '3h'
          },
          (error, token) => {
            if (error) {
              reject(error)
            } else {
              resolve(token);
            }
          }
        )
      })
    }
    else {
      throw new Error('wrong password');
    }
  }

  // 쿠키에 토큰 저장하고 성공 반환
  const respond = (token) => {
    res.cookie('token', token, {maxAge: 1000*60*60*3});
    res.status(200).json({
      msg: 'login success'
    });
  }

  const onError = (error) => {
    res.status(500).json({
      msg: error.message
    })
  }

  const check = (conn) => {
    pool.safeQuery(conn, query, params)
    .then(getUserData)
    .then(genAccessToken)
    .then(respond)
    .catch(onError)
  }


  pool.connect()
    .then(check)
    .catch(onError)
}

/**
 * 회원가입
 * @param {HttpRequest} req 
 * @param {HttpResponse} res 
 */
exports.register = (req, res) => {
  const { id, password, answer, question} = req.body

  // 비밀번호 암호화
  let salt = crypto.randomBytes(64).toString('base64');
  let hashPassword = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('base64');

  const params = [id, hashPassword, salt, question, answer];
  let query = `INSERT INTO USERS (userid, password, salt, question, answer) VALUES (?, ?, ?, ?, ?)`;
               
  const respond = ({connection, result}) => {
    new Promise((resolve) => {
      connection.release();
      resolve();
    })
    .then(() => {
      console.log("MySQL pool released: threadId " + connection.threadId);
      res.status(200).json({
        msg: 'success'
      })
    })
  }

  const onError = (error) => {
    res.status(500).json({
      msg: error.message
    })
  }

  const check = (conn) => {
    pool.safeQuery(conn, query, params)
    .then(respond)
    .catch(onError)
  }
    
  pool.connect()
   .then(check)
   .catch(onError)
}

/**
 * 로그아웃
 * @param {HttpRequest} req 
 * @param {HttpResponse} res 
 */
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
  })
}

/**
 * 로그인 여부 체크
 * JWT 미들웨어 거치기 때문에 무조건 True 반환
 * @param {HttpRequest} req 
 * @param {HttpResponse} res 
 */
exports.check = (req, res) => {
  res.status(200).json({
    success: true,
    info: req.decoded
  })
}

/**
 * 비밀번호 변경
 * @param {HttpRequest} req 
 * @param {HttpResponse} res 
 */
exports.changeUserPassword = (req, res) => {
  const id = req.decoded['user_id'];
  const {current_password, new_password} = req.body;
  let query = `SELECT password, salt FROM USERS WHERE userid = ?;`;

  const getUserData = ({result, connection}) => {
    if(result.length === 1) {
      let dbPassword = result[0].password;
      let salt = result[0].salt;
      return {dbPassword, salt, connection};
    }
    else {
      throw new Error("wrong id");
    }
  }

  const changePw= (data) => {
    // 기존 비밀번호하고 같으면 throw
    let oldPassword = crypto.pbkdf2Sync(new_password, data.salt, 100000, 64, 'sha512').toString('base64');
    if(data.dbPassword === oldPassword) {
      throw new Error("same password");
    }

    let hashPassword = crypto.pbkdf2Sync(current_password, data.salt, 100000, 64, 'sha512').toString('base64');
    if(data.dbPassword === hashPassword) {
      let newSalt = crypto.randomBytes(64).toString('base64');
      let newHashPassword = crypto.pbkdf2Sync(new_password, newSalt, 100000, 64, 'sha512').toString('base64');
      let updateQuery = `UPDATE USERS SET password = ?, salt = ? WHERE userid = ?;`;
      const updateParams = [newHashPassword, newSalt, id]
      return pool.safeQuery(data.connection, updateQuery, updateParams)
    } else {
      throw new Error("wrong password");
    }
  }


  const respond = ({result, connection}) => {
    new Promise((resolve) => {
      connection.release();
      resolve();
    })
    .then(() => {
      console.log("MySQL pool released: threadId " + connection.threadId);
      res.status(200).json({
        msg: 'success'
      })
    })
  }

  const check = (conn) => {
    pool.safeQuery(conn, query, [id])
    .then(getUserData)
    .then(changePw)
    .then(respond)
    .catch(onError)
  }

  const onError = (error) => {
    res.status(500).json({
      msg: error.message
    })
  }

  pool.connect()
  .then(check)
  .catch(onError)
}

/**
 * 비밀번호 찾기
 * @param {HttpRequest} req 
 * @param {HttpResponse} res 
 */
exports.findPassword = (req, res) => {
  const database = new Database();
  const {id, question, answer} = req.body;
  let query = `SELECT EXISTS (SELECT * FROM USERS WHERE userid="${id}" and question="${question}" and answer="${answer}") as success;`;
  let new_password = Math.random().toString(36).substr(2,11);
  const change = (result) => {
    if(result[0].success) {
      let salt = crypto.randomBytes(64).toString('base64');
      let hashPassword = crypto.pbkdf2Sync(new_password, salt, 100000, 64, 'sha512').toString('base64');
      let update_query = `UPDATE USERS SET password = "${hashPassword}", salt="${salt}" WHERE userid="${id}";`;
      database.query(update_query)
      .then(respond)
      .catch(onError)
    }
    else {
      res.status(200).json({
        msg: 'not match'
      })
    }
  }

  const respond = () => {
    res.status(200).json({
      msg: 'success',
      password: new_password
    })
  }
  
  const onError = (error) => {
    res.status(400).json({
      msg: error.message
    })
  }

  database.query(query)
  .then(change)
  .catch(onError)
}

/**
 * 회원 탈퇴
 * @param {HttpRequest} req 
 * @param {HttpResponse} res 
 */
exports.delete = (req, res) => {
  const database = new Database();
  const {id, password, } = req.body;
  let query1 = `SELECT password, salt FROM USERS WHERE userid = "${id}";`;

  const getData = (result) => {
    if(result.length === 1) {
      let dbPassword = result[0].password;
      let salt = result[0].salt;
      return {dbPassword, salt};
    }
    else {
      throw new Error();
    }
  }

  const check = (data) => {
    let hashPassword = crypto.pbkdf2Sync(password, data.salt, 100000, 64, 'sha512').toString('base64');
    if(data.dbPassword === hashPassword) {
      let query2 = `DELETE FROM USERS WHERE userid="${id}";`;
      database.query(query2)
      .then(respond)
      .catch(onError)
    }
    else {
      res.status(200).json({
        msg: 'fail'
      })
    }
    database.end();
  }

  const respond = () => {
    res.clearCookie('token');
    res.status(200).json({
      msg: 'success'
    })
  }

  const onError = (error) => {
    res.status(400).json({
      msg: error.message
    })
  }

  database.query(query1)
  .then(getData)
  .then(check)
  .catch(onError)
}