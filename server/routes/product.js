const express = require('express');
const router = express.Router();

const multer  = require('multer');
const { Product } = require("../models/Product");

//=================================
//            Product
//=================================

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 파일이 저장되는 위치
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // 위에서 정한 위치에 저장 시 사용할 파일명
        cb(null, `${Date.now()}_${file.originalname}`)
    }
  })
  
const upload = multer({ storage: storage }).single("file")

router.post('/image', (req, res) => {
    // 가져온 이미지를 multer 라이브러리를 사용하여 저장
    // filePath, fileName은 multer 라이브러리 API 참고
    upload(req, res, (err) => {
        if(err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })
})

router.post('/', (req, res) => {
    // 받아온 상품 정보를 MongoDB에 저장
    const product = new Product(req.body)

    product.save((err, doc) => {
        if(err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true })
    })
})

module.exports = router;
