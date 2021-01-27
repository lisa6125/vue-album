import multer from 'multer'
// import FTPStorage from 'multer-ftp'
import axios from 'axios'
import path from 'path'
import fs from 'fs'

import albums from '../models/albums.js'

// 本機開發，檔案存電腦
// 雲端環境，檔案存 FTP
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
  if (req.session.albumuser === undefined) {
    res.status(401).send({ success: false, message: '未登入' })
    return
  }
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400).send({ success: false, message: '資料不符' })
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
        const result = await albums.create({
          user: req.session.albumuser._id,
          name: req.session.albumuser.account,
          userpic: req.session.albumuser.file,
          description: req.body.description,
          count: req.body.count,
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

export const edit = async (req, res) => {
  if (req.session.albumuser === undefined) {
    res.status(401).send({ success: false, message: '未登入' })
    return
  }
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '資料不符' })
    return
  }
  try {
    let result = await albums.findById(req.params.id)
    if (result === null) {
      res.status(404).send({ success: false, message: '找不到資料' })
    } else if (result.user !== req.session.albumuser._id) {
      res.status(403).send({ success: false, message: '沒有權限' })
    } else {
      result = await albums.findByIdAndUpdate(req.params.id, req.body, { new: true })
      res.status(200).send({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else if (error.name === 'CastError') {
      res.status(400).send({ success: false, message: 'ID 格式錯誤' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const addcount = async (req, res) => {
  try {
    let result = await albums.findById(req.params.id)
    if (result === null) {
      res.status(404).send({ success: false, message: '找不到資料' })
    } else {
      result = await albums.findByIdAndUpdate(req.params.id, req.body, { new: true })
      res.status(200).send({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else if (error.name === 'CastError') {
      res.status(400).send({ success: false, message: 'ID 格式錯誤' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const deletee = async (req, res) => {
  if (req.session.albumuser === undefined) {
    res.status(401).send({ success: false, message: '未登入' })
    return
  }
  try {
    let result = await albums.findById(req.params.id)
    if (result === null) {
      res.status(404).send({ success: false, message: '找不到資料' })
    } else if (result.user !== req.session.albumuser._id) {
      res.status(403).send({ success: false, message: '沒有權限' })
    } else {
      result = await albums.findByIdAndDelete(req.params.id)
      res.status(200).send({ success: true, message: '', result })
      // 刪除本機圖片檔
      if (process.env.DEV === 'true') {
        fs.unlink('images/' + result.file, () => {})
      }
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ success: false, message: 'ID 格式錯誤' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const user = async (req, res) => {
  if (req.session.albumuser === undefined) {
    res.status(401).send({ success: false, message: '未登入' })
    return
  }
  if (req.session.albumuser._id !== req.params.user) {
    res.status(403).send({ success: false, message: '沒有權限' })
    return
  }

  try {
    const result = await albums.find({ user: req.params.user })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const alluser = async (req, res) => {
  try {
    const result = await albums.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const file = async (req, res) => {
  // 開發環境回傳本機圖片
  if (process.env.DEV === 'true') {
    const path = process.cwd() + '/images/' + req.params.file
    const exists = fs.existsSync(path)

    if (exists) {
      res.status(200).sendFile(path)
    } else {
      res.status(404).send({ success: false, message: '找不到圖片' })
    }
  } else {
    axios({
      method: 'GET',
      url: 'http://' + process.env.FTP_HOST + '/' + process.env.FTP_USER + '/' + req.params.file,
      responseType: 'stream'
    }).then(ress => {
      ress.data.pipe(res)
    }).catch(error => {
      res.status(error.response.status).send({ success: false, message: '取得圖片失敗' })
    })
  }
}
