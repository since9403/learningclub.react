const { text } = require('body-parser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
        default: []
    },
    sold: {
        type: Number,
        maxlength: 100,
        default: 0
    },
    continents: {
        type: Number,
        default: 1
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true })   // timestamps가 등록/수정시간을 자동으로 업데이트해준다


productSchema.index({      // SearchTerm 검색 시 $text : { $search: {term} } 과 연관
    title: 'text',
    description: 'text'
}, {
    weights: {
        title: 5,          // title의 중요도가 높다. 
        description: 1
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = { Product }