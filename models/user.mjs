import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);  // mongoose.model을 사용하여 'User' 모델을 생성하고, 이를 User 상수에 할당
export default User;                              // User 모델을 default export로 내보냄. 이는 CommonJS의 module.exports = ...와 유사한 역할을 한다
