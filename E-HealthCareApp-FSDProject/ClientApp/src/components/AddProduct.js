import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

export class AddProduct extends Component {

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

    async handleSave() {
        let error = 0;
        if (!/^\d+$/i.test(this.state.price)) {
            error = 1;
        } else if (!/^\d+$/i.test(this.state.quantity)) {
            error = 1;
        } else {
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
            console.log(data);
            const prodResponse = await fetch("/Product/addProduct", {
                method: 'POST',
                headers: {
                    'accept': 'text/plain',
                    'Authorization': "bearer " + sessionStorage.getItem("token"),
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
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
                const prodResult = await prodResponse.json();
                console.log(prodResult);
            }
        }
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
                <input type="text" id="txtName" onChange={(e) => this.handleNameChange(e.target.value)} /><br></br>
                <label>CompanyName</label><br></br>
                <input type="text" id="txtCompanyName" onChange={(e) => this.handleCompanyNameChange(e.target.value)} /><br></br>
                <label>Price</label><br></br>
                <input type="text" id="txtPrice" onChange={(e) => this.handlePriceChange(e.target.value)} /><br></br>
                <label>Quantity</label><br></br>
                <input type="text" id="txtQuantity" onChange={(e) => this.handleQuantityChange(e.target.value)} /><br></br>
                <label>Description</label><br></br>
                <input type="text" id="txtDescription" onChange={(e) => this.handleDescriptionChange(e.target.value)} /><br></br>
                <label>Uses</label><br></br>
                <input type="text" id="txtUses" onChange={(e) => this.handleUsesChange(e.target.value)} /><br></br>
                <label>ExpireDate</label><br></br>
                <input type="text" id="txtExpireDate" onChange={(e) => this.handleExpireDateChange(e.target.value)} /><br></br>
                <Link to="/products">
                    <button onClick={() => this.handleSave()}> Save </button>
                </Link>
            </Fragment>
        );
    }
}