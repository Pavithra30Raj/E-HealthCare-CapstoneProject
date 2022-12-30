import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

export class EditProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            name: "string",
            companyName: "string",
            price: 0,
            quantity: 0,
            description: "string",
            uses: "string",
            expireDate: "string"
        }
    }

    componentDidMount() {
        this.handleLoad();
    }

    async handleLoad() {
        console.log("Sending inserted data to backend.");
        console.log(sessionStorage.getItem('prodEditId'));

        const prodResponse = await fetch("/Product/getProductById/" + sessionStorage.getItem("prodEditId"), {
            method: 'GET',
            headers: {
                'Authorization': "bearer " + sessionStorage.getItem("token")
            },
        });
        const prodResult = await prodResponse.json();
        console.log(prodResult);
        this.setState({id: prodResult.id });
        this.setState({name: prodResult.name});
        this.setState({companyName: prodResult.companyName});
        this.setState({price: prodResult.price});
        this.setState({quantity: prodResult.quantity});
        this.setState({description: prodResult.description});
        this.setState({uses: prodResult.uses});
        this.setState({ expireDate: prodResult.expireDate });
    }

    async handleSave() {
        let data = {
            id: this.state.id,
            name: this.state.name,
            companyName: this.state.companyName,
            price: this.state.price,
            quantity: this.state.quantity,
            description: this.state.description,
            uses: this.state.uses,
            expireDate: this.state.expireDate
        }
        const prodResponse = await fetch("/Product/updateMedicine/" + sessionStorage.getItem("prodEditId"), {
            method: 'PUT',
            headers: {
                'accept': 'text/plain',
                'Authorization': "bearer " + sessionStorage.getItem("token"),
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const prodResult = await prodResponse.json();
        console.log(prodResult);
    }

    handleNameChange = (value) => {
        this.setState({ name: value });
    }
    handleCompanyNameChange = (value) => {
        this.setState({ companyName: value });
    }
    handlePriceChange = (value) => {
        this.setState({ price: value });
    }
    handleQuantityChange = (value) => {
        this.setState({ quantity: value });
    }
    handleDescriptionChange = (value) => {
        this.setState({ description: value });
    }
    handleUsesChange = (value) => {
        this.setState({ uses: value });
    }
    handleExpireDateChange = (value) => {
        this.setState({ expireDate: value });
    }

    render() {
        return (
            <Fragment>
                <div>Prod Edit</div>
                <label>Name</label><br></br>
                <input type="text" id="txtName" value={this.state.name} onChange={(e) => this.handleNameChange(e.target.value)} /><br></br>
                <label>CompanyName</label><br></br>
                <input type="text" id="txtCompanyName" value={this.state.companyName} onChange={(e) => this.handleCompanyNameChange(e.target.value)} /><br></br>
                <label>Price</label><br></br>
                <input type="text" id="txtPrice" value={this.state.price} onChange={(e) => this.handlePriceChange(e.target.value)} /><br></br>
                <label>Quantity</label><br></br>
                <input type="text" id="txtQuantity" value={this.state.quantity} onChange={(e) => this.handleQuantityChange(e.target.value)} /><br></br>
                <label>Description</label><br></br>
                <input type="text" id="txtDescription" value={this.state.description} onChange={(e) => this.handleDescriptionChange(e.target.value)} /><br></br>
                <label>Uses</label><br></br>
                <input type="text" id="txtUses" value={this.state.uses} onChange={(e) => this.handleUsesChange(e.target.value)} /><br></br>
                <label>ExpireDate</label><br></br>
                <input type="text" id="txtExpireDate" value={this.state.expireDate} onChange={(e) => this.handleExpireDateChange(e.target.value)} /><br></br>
                <Link to="/products">
                    <button onClick={() => this.handleSave()}> Save </button>
                </Link>
            </Fragment>
        );
    }
}