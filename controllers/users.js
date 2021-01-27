import md5 from 'md5'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import users from '../models/users.js'

const storage = multer.diskStorage({
  // req 請求
  // file 檔案資訊
  // callback 處理的 function
  destination (req, file, callback) {
    // callback(null, 資料夾)
    callback(null, './images/')
  },
  async filename (req, file, callback) {
    let filename = Date.now() + path.extname(file.originalname)
    const filepath = process.cwd() + '/images/' + filename
    const exists = fs.existsSync(filepath)
    console.log(filepath, exists)
    if (exists) {
      filename = Date.now() + '1' + path.extname(file.originalname)
    }
    // callback(null, 檔名)
    // 時間當檔名 + 原上傳檔案的副檔名
    callback(null, filename)
  }
})

// 上傳設定
const upload = multer({
  storage,
  // 過濾檔案
  fileFilter (req, file, callback) {
    if (file.mimetype.includes('image')) {
      callback(null, true)
    } else {
      // 回應一個 multer 錯誤
      // 因為套件觸發的錯誤類型是 MulterError
      // 觸發跟套件一樣的錯誤類型保持格式統一，就不用另外寫判斷是哪種錯誤，也能直接知道是上傳發生的錯誤
      // LIMIT_FORMAT 是自訂錯誤 CODE，和內建的格式統一
      callback(new multer.MulterError('LIMIT_FORMAT'), false)
    }
  },
  limits: {
    // 大小限制 1MB
    // 單位是 B
    // 1KB = 1024B
    // 1MB = 1024KB
    fileSize: 1024 * 1024
  }
})

export const create = async (req, res) => {
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400).send({ success: false, message: '資料格式不符' })
    return
  }
  upload.single('image')(req, res, async error => {
    if (error instanceof multer.MulterError) {
      let message = ''
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大'
      } else if (error.code === 'LIMIT_FORMAT') {
        message = '格式不符'
      } else {
        message = '上傳錯誤'
      }
      res.status(400).send({ success: false, message })
    } else if (error) {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    } else {
      try {
        let file = ''
        if (process.env.DEV === 'true') {
          file = req.file.filename
        } else {
          file = path.basename(req.file.path)
        }
        const result = await users.create({
          account: req.body.account,
          password: md5(req.body.password),
          file
        })
        res.status(200).send({ success: true, message: '', result })
      } catch (error) {
        if (error.name === 'ValidationError') {
          const key = Object.keys(error.errors)[0]
          const message = error.errors[key].message
          res.status(400).send({ success: false, message })
        } else {
          res.status(500).send({ success: false, message: '伺服器錯誤' })
        }
      }
    }
  })
}

export const login = async (req, res) => {
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '資料格式不符' })
    return
  }
  try {
    const result = await users.findOne({
      account: req.body.account,
      password: md5(req.body.password)
    }, '-password')
    if (result === null) {
      res.status(404).send({ success: false, message: '帳號或密碼錯誤' })
    } else {
      req.session.albumuser = result
      res.status(200).send({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
    console.log(error)
  }
}
export const logout = async (req, res) => {
  req.session.destroy(error => {
    if (error) {
      res.status(500).send({ success: false, message: '發生錯誤，無法登出' })
    } else {
      res.clearCookie()
      res.status(200).send({ success: true, message: '' })
    }
  })
}
export const heartbeat = async (req, res) => {
  let isLogin = false
  if (req.session.albumuser) {
    isLogin = true
  }
  res.status(200).send(isLogin)
}
