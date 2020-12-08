import mongoose from 'mongoose'

const Schema = mongoose.Schema

const albumSchema = new Schema({
  user: {
    type: String
  },
  description: {
    type: String,
    maxlength: [200, '說明必須兩百字以下']
  },
  file: {
    type: String,
    required: [true, '缺少檔名']
  }
},
{
  versionKey: false
}
)

const albums = mongoose.model('albums', albumSchema)
export default albums
