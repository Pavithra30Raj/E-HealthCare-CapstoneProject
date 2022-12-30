import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Products extends Component {
    static displayName = Products.name;

    constructor(props) {
        super(props);
        this.state = { products: [], loading: true, use: "ALL" };
    }

    componentDidMount() {
        this.populateProductData();
    }

    save(id) {
        sessionStorage.setItem('prodEditId', id);
    }

    handleSearchByUse = (value) => {
        this.setState({ use: value });
    }

    async buttonSearch() {
        if (this.state.use == "ALL") {
            this.populateProductData();
        }
        else {
            const getAllProducts = await fetch("Product/getProductByUse/" + this.state.use, {
                method: 'GET',
                headers: {
                    'Authorization': "bearer " + sessionStorage.getItem("token")
                }
            });
            const data = await getAllProducts.json();
            console.log(data);
            if (data.message != "Error")
                this.setState({ products: data, loading: false });
            else
                this.setState({ loading: false });
        }
    }

    render() {
        
        if (sessionStorage.getItem("role") == "1") {
            return (
                <div>
                    <h1 id="tabelLabel" >Available products</h1>
                    <label>Search: </label>
                    <input type="text" id="txtUse" value={this.state.use} onChange={(e) => this.handleSearchByUse(e.target.value)} /><br></br>
                    <button className="btn btn-primary" onClick={() => this.buttonSearch()}> Search </button>
                    <table className='table table-striped' aria-labelledby="tabelLabel">
                        <thead>
                            <tr>
                                <th>Product name</th>
                                <th>Produced by</th>
                                <th>Product description</th>
                                <th>Good for</th>
                                <th>Best before</th>
                                <th>Left in stock</th>
                                <th>Price</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.products.map(prod =>
                                <tr key={prod.id}>
                                    <td>{prod.name}</td>
                                    <td>{prod.companyName}</td>
                                    <td>{prod.description}</td>
                                    <td>{prod.uses}</td>
                                    <td>{prod.expireDate}</td>
                                    <td>{prod.quantity}</td>
                                    <td>{prod.price}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => this.addToCart(prod.id)}> Add </button>
                                        <button className="btn btn-primary" onClick={() => this.removeFromCart(prod.id)}> Remove </button>
                                        <br></br>
                                        <Link to="/editProduct">
                                            <button className="btn btn-primary" onClick={() => this.save(prod.id)}> Edit </button>
                                        </Link>
                                        <button className="btn btn-primary" onClick={() => this.deleteProduct(prod.id)}> Delete </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                );
        }
        else if (sessionStorage.getItem("role") == "0") {
            return (
                <div>
                    <h1 id="tabelLabel" >Available products</h1>
                    <label>Search: </label>
                    <input type="text" id="txtUse" value={this.state.use} onChange={(e) => this.handleSearchByUse(e.target.value)} /><br></br>
                    <button className="btn btn-primary" onClick={() => this.buttonSearch()}> Search </button>
                    <table className='table table-striped' aria-labelledby="tabelLabel">
                        <thead>
                            <tr>
                                <th>Product name</th>
                                <th>Produced by</th>
                                <th>Product description</th>
                                <th>Good for</th>
                                <th>Best before</th>
                                <th>Left in stock</th>
                                <th>Price</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.products.map(prod =>
                            <tr key={prod.id}>
                                <td>{prod.name}</td>
                                <td>{prod.companyName}</td>
                                <td>{prod.description}</td>
                                <td>{prod.uses}</td>
                                <td>{prod.expireDate}</td>
                                <td>{prod.quantity}</td>
                                <td>{prod.price}</td>
                                <td>
                                    <button className="btn btn-primary" onClick={() => this.addToCart(prod.id)}> Add </button>
                                    <button className="btn btn-primary" onClick={() => this.removeFromCart(prod.id)}> Remove </button>
                                </td>
                            </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                );
        }
    }

    async addToCart(id) {
        const cartAdd = await fetch('/Cart/addToCart/' + id, {
            method: 'PUT',
            headers: {
                'Authorization': "bearer " + sessionStorage.getItem("token")
            }
        });
        const data = await cartAdd.json();
        console.log(data);
        this.populateProductData();
    }

    async removeFromCart(id) {
        const cartAdd = await fetch('/Cart/removeFromCart/' + id, {
            method: 'PUT',
            headers: {
                'Authorization': "bearer " + sessionStorage.getItem("token")
            }
        });
        const data = await cartAdd.json();
        console.log(data);
        this.populateProductData();
    }

    async deleteProduct(id) {
        const delProd = await fetch('/Product/deleteProduct/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': "bearer " + sessionStorage.getItem("token")
            }
        });
        const data = await delProd.json();
        console.log(data);
        this.populateProductData();
    }

    async populateProductData() {
        const getAllProducts = await fetch('Product/getAllProducts', {
            method: 'GET',
            headers: {
                'Authorization': "bearer " + sessionStorage.getItem("token")
            }
        });
        const data = await getAllProducts.json();
        console.log(data);
        if (data.message != "Error")
            this.setState({ products: data, loading: false });
        else
            this.setState({ loading: false });
    }
}
