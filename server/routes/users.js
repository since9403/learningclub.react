const express = require('express');
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");
const { request } = require('express');
const { Product } = require('../models/Product');

//=================================
//             User
//=================================

router.get('/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history,
    });
});

router.post('/register', (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get('/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.post('/addToCart', auth, (req, res) => {
    // User Collection에 해당 유저의 정보를 가져오기
    User.findOne({_id: req.user._id},  // user._id로 가능한 이유는 auth middleware 덕분. req.user에 user 정보가 있다
        (err, userInfo) => {        
            let duplicate = false;
            // 가져온 정보에서 Cart에 넣으려하는 상품이 이미 있는지 확인
            userInfo.cart.forEach((item) => {
                if(item.id == req.body.productId) {
                    duplicate = true;  // 쿼리에서 얻어온 cart에 신규 추가하려는 상품이 있는지 확인
                }
            })

            if (duplicate) { // 상품이 이미 있을 때
                User.findOneAndUpdate({ _id: req.user._id, "cart.id": req.body.productId }, // id가 req.user._id 이고 id의 cart.id가 req.body.productId인 객체를 찾아서
                                     { $inc: { "cart.$.quantity": 1 } }, // cart.quantity를 하나 더하고
                                     { new: true }, // 업데이트한 값을 리턴한다
                                     (err, userInfo) => {
                                         if(err) return res.status(400).json({ success: false, err });
                                         return res.status(200).send(userInfo.cart) // cart 필드만 리턴
                                     }
                )                         
            } else { // 상품이 없을 때
                User.findOneAndUpdate({ _id: req.user._id },
                                   {
                                       $push: { // 찾은 객체에 push하는데
                                           cart: { // push하는 필드는 cart
                                               id: req.body.productId,
                                               quantity: 1,
                                               date: Date.now()
                                           }
                                       }
                                    },
                                    { new: true },
                                    (err, userInfo) => {
                                        if(err) return res.status(400).json({ success: false, err });
                                        return res.status(200).json(userInfo.cart)
                                    }
                )
            }
        })
    });


    router.get('/removeFromCart', auth, (req, res) => {
        // User Collection의 cart 내에서 id가 일치하는 product 삭제
        User.findOneAndUpdate(
            { _id: req.user._id },
            {
                $pull: { // 제거할 때 pull 사용
                    cart : {
                        id: req.query.id
                    }
                }
            },
            {
                new: true
            },
            (err, userInfo) => {
                // Redux의 cartDetail 정보 업데이트 (Product Collection에서 현재 남아있는 상품들의 정보 가져오기)
                let cart = userInfo.cart;
                let array = cart.map(item => {
                    return item.id
                })

                // Product Collection에서 array에 있는 id 값과 같은 것을 모두 찾아옴
                Product.find({ _id : { $in : array } })
                    .populate('writer')
                    .exec((err, productInfo) => {
                        if(err) res.status(400).json({ status: false, err })
                        return res.status(200).json({
                            // Product Collection(=productInfo)과 User Collection(=cart)을 합친 것이 cartDetail
                            productInfo,
                            cart
                        })
                    })
            }
        )
    });


module.exports = router;
