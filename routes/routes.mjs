import User from '../models/user.mjs';

// const router = require('express').Router;
import { Router } from 'express'; // ES 모듈 문법을 사용하여 express 패키지에서 Router를 직접 import
                                  // 중괄호 { } 를 사용하는 것은 named import를 의미하며, express 모듈에서 Router라는 이름의 export를 가져온다
const router = Router();          // import한 Router 함수를 호출하여 새로운 router 인스턴스를 생성. 이 부분은 CommonJS 문법과 동일
const routes = router();
routes.post('/register', (req, res) => {

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  res.send('Hello, World! ES Modules are working!');
}); // export default routes;

export default routes;
