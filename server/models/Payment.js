const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    user: {
        type: Array,
        default: []
    },
    data: {
        type: Array,
        default: []
    },
    product: {
        type: Array,
        default: []
    }
}, { timestamps: true })   // timestamps가 등록/수정시간을 자동으로 업데이트해준다

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = { Payment }