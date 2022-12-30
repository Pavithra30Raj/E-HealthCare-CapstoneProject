import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Cart extends Component {
    static displayName = Cart.name;

    constructor(props) {
        super(props);
        this.state = { carts: [], loading: true };
    }

    componentDidMount() {
        this.populateUserData();
    }

    static renderUsersTable(carts) {
        if(carts != [])
            return (
                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>Product name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carts.map(cart =>
                            <tr key={cart.name}>
                                <td>{cart.name}</td>
                                <td>{cart.quantity}</td>
                                <td>{cart.price}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            );
        else
            return (
                <p>Empty Cart</p>
            );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Cart.renderUsersTable(this.state.carts);

        return (
            <div>
                <h1 id="tabelLabel" >Products in cart list</h1>
                <p>This is a list of all products in your cart.</p>
                <Link to="/">
                    <button className="btn btn-primary" onClick={() => this.buy()}> Buy </button>
                </Link>
                {contents}
            </div>
        );
    }

    async populateUserData() {
        const response = await fetch('/Cart/getCartByUserId', {
            method: 'GET',
            headers: {
                'accept': 'text/plain',
                'Authorization': "bearer " + sessionStorage.getItem("token")
            },
        });
        const data = await response.json();
        console.log(data);
        if (data.message != "Error")
            this.setState({ carts: data, loading: false });
        else
            this.setState({loading: false });
    }

    async buy() {
        let error = 0;
        const response = await fetch("/Order/buyCartContent", {
            method: 'PUT',
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
            const result = await response.json();
            console.log(result.status);
        }
    }
}
