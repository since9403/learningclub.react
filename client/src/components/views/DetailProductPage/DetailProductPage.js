import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col } from 'antd';

import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';

function DetailProductPage(props) {

    const productId = props.match.params.productId;   // url에서 :productId 부분
    const [Product, setProduct] = useState({})

    useEffect(() => {
        axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                setProduct(response.data.product[0])
            })
            .catch(err => alert(err))
    }, [])

    return (
        <div style={{ width: '100%', padding: '3rem 4rem' }}>

            <div style={{ display: 'flex',justifyContent: 'center'}}>
                <h1>{Product.title}</h1>
            </div>

            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24}>
                    {/* ProductImage */}
                    <ProductImage detail={Product} />
                </Col>
                <Col lg={12} xs={24}>
                    {/* ProductInfo */}
                    <ProductInfo detail={Product} />
                </Col>
            </Row>
        </div>
    )
}

export default DetailProductPage