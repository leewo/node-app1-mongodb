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

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    console.error('Registration error:', error);
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

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,   // JWT_SECRET 환경 변수를 사용하여 비밀 키를 가져옴. dotenv를 사용하여 환경 변수를 로드. JWT_SECRET을 .env 파일에 설정해야 한다
      { expiresIn: '1h' }
    );

    // HttpOnly 쿠키로 토큰 설정
    res.cookie('auth-token', token, {
      httpOnly: true,                                 // 토큰을 HttpOnly 쿠키로 설정. 이는 클라이언트 측 JavaScript에서 쿠키에 접근할 수 없게 하여 XSS 공격으로부터 보호한다
      secure: process.env.NODE_ENV === 'production',  // 프로덕션 환경에서는 secure 옵션을 true로 설정하여 HTTPS에서만 쿠키가 전송되도록 한다
      sameSite: 'strict',                             // sameSite 옵션을 'strict'로 설정하여 쿠키가 동일 출처에서만 전송되도록 한다. CSRF 공격을 방지하기 위한 것
      maxAge: 24 * 60 * 60 * 1000                     // maxAge 옵션을 사용하여 쿠키의 만료 시간을 설정. 이 경우 24시간
    });

    res.status(200).json({ message: 'User logged in successfully' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: 'Error logging in', error: error.message });
  }
});

export default router;
