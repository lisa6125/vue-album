import express from 'express'
import { create, edit, deletee, alluser, user, addcount, file } from '../controllers/albums.js'

const router = express.Router()

router.post('/', create)
router.patch('/:id', edit)
router.delete('/:id', deletee)
router.get('/', alluser)
router.patch('/addcount/:id', addcount)
router.get('/user/:user', user)
router.get('/file/:file', file)

export default router
