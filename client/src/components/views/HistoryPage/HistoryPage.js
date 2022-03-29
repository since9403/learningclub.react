import React from 'react'

function HistoryPage(props) {

    return (
        <div style={{ width: '80%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <h1>History</h1>
            </div>
            <br />

            <table>
                <thead>
                    <tr>
                        <th>Payment Id</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Date of Purchase</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        props.user.userData &&
                        props.user.userData.history.map(item => (
                            <tr key={item.paymentId}>
                                <th>{item.paymentId}</th>
                                <th>{item.price}</th>
                                <th>{item.quantity}</th>
                                <th>{item.dateOfPurchase}</th>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default HistoryPage