import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import UserCardBlock from './Sections/UserCardBlock'
import { getCartItems } from '../../../_actions/user_actions'

function CartPage(props) {

    const dispatch = useDispatch();

    const [Total, setTotal] = useState(0)

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
    }

    return (
        <div style={{ width: '85%', margin: '3rem auto'}}>
            <h1>My Cart</h1>
            
            <div>
                {/* Redux의 user에 있는 cartDetail 정보가 있으면 가져온다 */}
                <UserCardBlock products={props.user.cartDetail} />
            </div>

            <div style={{ marginTop: '3rem' }}>
                <h2>Total Amount: ${Total}</h2> 
            </div>
        </div>
    )
}

export default CartPage