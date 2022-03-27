import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import UserCardBlock from './Sections/UserCardBlock'
import { getCartItems } from '../../../_actions/user_actions'

function CartPage(props) {

    const dispatch = useDispatch();

    useEffect(() => {

        let cartItems = []
        // Redux - User state의 cart 안에 상품이 있는지 확인
        if(props.user.userData && props.user.userData.cart) {
            if(props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id)  // Cart에 저장된 상품의 id를 가져온다
                })

                dispatch(getCartItems(cartItems, props.user.userData.cart))
            }
        }
    }, [props.user.userData])

    return (
        <div style={{ width: '85%', margin: '3rem auto'}}>
            <h1>My Cart</h1>
            
            <div>
                {/* Redux의 user에 있는 cartDetail 정보가 있으면 가져온다 */}
                <UserCardBlock products={props.user.cartDetail} />
            </div>
        </div>
    )
}

export default CartPage