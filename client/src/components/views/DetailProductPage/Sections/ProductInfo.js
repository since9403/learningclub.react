import React, { useEffect, useState } from 'react'
import { Descriptions, Button } from 'antd'

import { addToCart } from '../../../../_actions/user_actions';
import { useDispatch } from 'react-redux'

function ProductInfo(props) {

  const dispatch = useDispatch();

  const clickHandler = () => {
    // 필요한 정보를 User Model의 cart 필드에 넣기 위함..
    // 필요한 정보 = ProductId, Quantity, Date
    dispatch(addToCart(props.detail._id))
  }

  return (
    <div>
        <Descriptions title="Product Info" bordered>
          <Descriptions.Item label="Price">{props.detail.price}</Descriptions.Item>
          <Descriptions.Item label="Sold">{props.detail.sold}</Descriptions.Item>
          <Descriptions.Item label="View">{props.detail.views}</Descriptions.Item>
          <Descriptions.Item label="Description">{props.detail.description}</Descriptions.Item>
        </Descriptions>

        <br />
        <br />
        <br />
        <div style={{ display: 'flex', justifyContent: 'center'}}>
          <Button size="large" shape="round" type="danger" onClick={clickHandler}>
            Add to Cart
          </Button>
        </div>
    </div>
  )
}

export default ProductInfo