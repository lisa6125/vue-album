import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import session from 'express-session'
import connectMongo from 'connect-mongo'

import routerUser from './routers/users.js'
import routerAlbum from './routers/albums.js'

dotenv.config()

mongoose.connect(process.env.DBURL) //, { useNewUrlParser: true, useUnifiedTopology: true }

const app = express()

app.use(bodyParser.json())

app.use(cors({
  origin (origin, callback) {
    if (origin === undefined) {
      callback(null, true)
    } else {
      if (process.env.DEV === 'true') {
        callback(null, true)
      } else if (origin.includes('github')) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed'), false)
      }
    }
  },
  credentials: true
}))

// const MongoStore = connectMongo(session)
// app.use(session({
//   secret: '123',
//   store: new MongoStore({
//     mongooseConnection: mongoose.connection
//   })
// }))
const MongoStore = connectMongo(session)
const sessionSettings = {
  secret: 'album',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {
    maxAge: 1000 * 60 * 30
  },
  saveUnintialized: false,
  rolling: true,
  resave: true
}

if (process.env.DEV === 'false') {
  sessionSettings.cookie.sameSite = 'none'
  sessionSettings.cookie.secure = true
}
app.use(session(sessionSettings))

app.set('trust proxy', 1)
app.use('/users', routerUser)
app.use('/albums', routerAlbum)
// bodyparser cors 之類的套件發生錯誤時的處理
// app.use((err, req, res, next) => {})
// err 發生的錯誤
// next 繼續到下一個 middleware，因為這是最後一個所以不需要
// _ 代表不使用 function 的參數
app.use((_, req, res, next) => {
  res.status(500).send({ success: false, message: '伺服器錯誤' })
})
app.listen(process.env.PORT, () => {
  console.log('server started')
})
