import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
  account: {
    type: String,
    minlength: [4, '帳號必須四字以上'],
    maxlength: [20, '帳號必須二十字以下'],
    unique: true,
    required: '帳號必填'
  },
  password: {
    type: String,
    required: [true, '請輸入密碼']
  },
  file: {
    type: String,
    required: [true, '缺少頭貼']
  }
},
{
  versionKey: false
}
)

const users = mongoose.model('users', userSchema)
export default users
