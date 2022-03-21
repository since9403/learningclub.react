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
        if(err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true })
    })
})


router.post('/products', (req, res) => {
    // MongoDB 내 Product collection에 저장된 상품 데이터 가져오기
    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    let term = req.body.searchTerm;

    let findArgs = {};
    for(let key in req.body.filters) { // key는 continents 또는 price
        // continents 또는 price에서 필터링 할 것이 있으면 필터링 된 데이터를,
        // 필터링 할 것이 없으면(length == 0) 전체 데이터를 가져올 수 있다
        if(req.body.filters[key].length > 0) {
            if(key === "price") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
    
    if(term) {
        Product.find(findArgs) // Product Collection에 있는 모든 데이터를 찾는다. find() 내에 조건을 object 형식으로 넣으면 조건에 맞게 찾을 수 있음
        .find({ $text: { $search: term } }) // MongoDB에서 제공하는 기능
        .populate("writer") // writer의 ObjectId를 이용하여 writer의 모든 정보를 가져온다
        .skip(skip)
        .limit(limit)
        .exec((err, productInfo) => {  // 위에서 생성한대로 쿼리를 실행하여 err 또는 document를 반환. document에 내가 원하는 데이터가 있다
            if(err) return res.status(400).json({ success: false, err })
            return res.status(200).json({ 
                success: true, 
                productInfo,
                postSize: productInfo.length})
        })
    } else {
        Product.find(findArgs) // Product Collection에 있는 모든 데이터를 찾는다. find() 내에 조건을 object 형식으로 넣으면 조건에 맞게 찾을 수 있음
            .populate("writer") // writer의 ObjectId를 이용하여 writer의 모든 정보를 가져온다
            .skip(skip)
            .limit(limit)
            .exec((err, productInfo) => {  // 위에서 생성한대로 쿼리를 실행하여 err 또는 document를 반환. document에 내가 원하는 데이터가 있다
                if(err) return res.status(400).json({ success: false, err })
                return res.status(200).json({ 
                    success: true, 
                    productInfo,
                    postSize: productInfo.length})
            })
    }
})

router.get('/products_by_id', (req, res) => {
    
    // productId를 이용, DB에서 productId와 같은 상품의 정보를 가져온다
    let type= req.query.type           // type=single
    let productId = req.query.id       // id=${productId}, 쿼리 스트링 처리방법

    Product.find({ _id: productId })
        .populate("writer")
        .exec((err, product) => {
            if(err) return res.status(400).json({ success: false, err})
            return res.status(200).json({ success: true, product })
        })
})


module.exports = router;
