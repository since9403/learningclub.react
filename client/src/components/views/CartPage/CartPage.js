import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { Empty } from 'antd';
import PayPal from '../../utils/PayPal' 
import UserCardBlock from './Sections/UserCardBlock'
import { removeCartItem, getCartItems } from '../../../_actions/user_actions'

function CartPage(props) {

    const dispatch = useDispatch();

    const [Total, setTotal] = useState(0)
    const [ShowTotal, setShowTotal] = useState(false)

    useEffect(() => {
        let cartItems = []

        // Redux - User state의 cart 안에 상품이 있는지 확인
        if(props.user.userData && props.user.userData.cart) {
            if(props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id)  // Cart에 저장된 상품의 id를 가져온다
                })

                dispatch(getCartItems(cartItems, props.user.userData.cart))
                .then(response => { calculateTotal(response.payload) })
            }
        }
    }, [props.user.userData])
    
    let calculateTotal = (cartDetail) => {
        let total = 0

        cartDetail.map(item => {
            total += parseInt(item.price, 10) * item.quantity
        })

        setTotal(total)
        setShowTotal(true)
    }

    let removeFromCart = (productId) => {
        dispatch(removeCartItem(productId))
            .then(response => {
                // Cart 내 상품을 지운 후 처리하는 부분
                console.log(response.payload.cart.length)

                if(response.payload.productInfo.length <= 0) {
                    setShowTotal(false)
                }
            })
    }

    return (
        <div style={{ width: '85%', margin: '3rem auto'}}>
            <h1>My Cart</h1>
            
            <div>
                {/* Redux의 user에 있는 cartDetail 정보가 있으면 가져온다 */}
                <UserCardBlock products={props.user.cartDetail} removeItem={removeFromCart} />
            </div>

            {
                ShowTotal?
                <div style={{ marginTop: '3rem' }}>
                    <h2>Total Amount: ${Total}</h2> 
                </div>
                :
                <>
                    <br />
                    <Empty description={false} />
                </>
            }

            {
                ShowTotal && <PayPal total={Total} />
            }

        </div>
    )
}

export default CartPage