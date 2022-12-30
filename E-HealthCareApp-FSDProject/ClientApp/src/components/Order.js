import React, { Component } from 'react';
import { format } from 'date-fns';

export class Order extends Component {
    static displayName = Order.name;

    constructor(props) {
        super(props);
        this.state = { orders: [], loading: true };
    }

    componentDidMount() {
        this.populateOrderData();
    }

    static renderOrdersTable(orders) {
            return (
                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>Product names</th>
                            <th>Total price of order</th>
                            <th>Order status</th>
                            <th>Date placed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order =>
                            <tr key={order.productNames}>
                                <td>{order.productNames}</td>
                                <td>{order.totalPrice}</td>
                                <td>{order.status}</td>
                                <td>{format(new Date(order.dateTime.substring(0, 4), order.dateTime.substring(5, 7), order.dateTime.substring(8, 10)), 'dd/MM/yyyy').toString()}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            );
    }

    render() {
        let contents = Order.renderOrdersTable(this.state.orders);

        return (
            <div>
                <h1 id="tabelLabel" >List of previous orders</h1>
                <p>This is a list of all your previous orders.</p>
                {contents}
            </div>
        );
    }

    async populateOrderData() {
        let error = 0;
        const response = await fetch('/Order/getOrderByUserId', {
            method: 'GET',
            headers: {
                'accept': 'text/plain',
                'Authorization': "bearer " + sessionStorage.getItem("token")
            },
        }).then(response => {
            console.log(response.status);
            if (response.status >= 400) {
                console.log(response.status);
                throw new Error();
            }
            else {
                return response;
            }
        }).catch((e) => {
            console.log("Error");
            error = 1;
        });
        if (error == 0) {
            const data = await response.json();
            console.log(data);
            this.setState({ orders: data, loading: false });
        }
    }
}
