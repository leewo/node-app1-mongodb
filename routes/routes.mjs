import User from '../models/user.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// const router = require('express').Router;
import { Router } from 'express'; // ES 모듈 문법을 사용하여 express 패키지에서 Router를 직접 import
// 중괄호 { } 를 사용하는 것은 named import를 의미하며, express 모듈에서 Router라는 이름의 export를 가져온다
const router = Router();          // import한 Router 함수를 호출하여 새로운 router 인스턴스를 생성. 이 부분은 CommonJS 문법과 동일

router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(req.body, hashedPassword);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign( // jwt.sign() 메서드를 사용하여 토큰을 생성
      { _id: user._id },    // 첫 번째 인수: 토큰에 포함될 데이터
      'secret',             // 두 번째 인수: 토큰을 서명하기 위한 비밀 키
      { expiresIn: '1h' }   // 세 번째 인수: 토큰의 만료 시간. '1h'은 토큰이 1시간 후에 만료되도록 설정
    );
    res.header('auth-token', token);  // 헤더에 토큰을 추가
    res.header('access-control-expose-headers', 'auth-token'); // 클라이언트가 헤더에 접근할 수 있도록 헤더를 노출
    res.status(200).json({ message: 'User logged in successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error logging in', error: error.message });
  }
});

export default router;
