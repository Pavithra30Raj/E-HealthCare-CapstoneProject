import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

export class EditSelf extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: "string",
            lastName: "string",
            dateOfBirth: "string",
            phone: "string",
            address: "string",
            funds: 0,
            error: 0
        };
    }

    componentDidMount() {
        this.handleLoad();
    }

    async handleLoad() {
        const accResponse = await fetch("/Account/getUser", {
            method: 'GET',
            headers: {
                'Authorization': "bearer " + sessionStorage.getItem("token")
            },
        });
        const accResult = await accResponse.json();
        console.log(accResult);
        this.setState({ firstName: accResult.firstName });
        this.setState({ lastName: accResult.lastName});
        this.setState({ dateOfBirth: accResult.dateOfBirth});
        this.setState({ phone: accResult.phone});
        this.setState({ address: accResult.address});
        this.setState({ funds: accResult.funds});
    }

    async handleSave() {
        if (!/^(?:0[1-9]|[12]\d|3[01])([\/.-])(?:0[1-9]|1[0-2])\1(?:19|20)\d\d$/i.test(this.state.dateOfBirth)) {
            this.setState({ error: 400 });
        } else if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/i.test(this.state.phone)) {
            this.setState({ error: 400 });
        } else {
            let data = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                dateOfBirth: this.state.dateOfBirth,
                phone: this.state.phone,
                address: this.state.address,
                funds: this.state.funds
            }
            console.log(data)
            const accResponse = await fetch("/Account/editOwnAccount", {
                method: 'POST',
                headers: {
                    'accept': 'text/plain',
                    'Authorization': "bearer " + sessionStorage.getItem("token"),
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const accResult = await accResponse.json();
            console.log(accResult);
        }
    }

    handleFirstNameChange = (value) => {
        this.setState({ firstName: value });
    }
    handleLastNameChange = (value) => {
        this.setState({ lastName: value });
    }
    handleDobChange = (value) => {
        this.setState({ dob: value });
    }
    handlePhoneChange = (value) => {
        this.setState({ phone: value });
    }
    handleAddressChange = (value) => {
        this.setState({ address: value });
    }
    handleFundsChange = (value) => {
        this.setState({ funds: value });
    }

    render() {
        return (
            <Fragment>
                <div>User Edit</div>
                <label>First Name</label><br></br>
                <input type="text" id="txtName" value={this.state.firstName} onChange={(e) => this.handleFirstNameChange(e.target.value)} /><br></br>
                <label>Last Name</label><br></br>
                <input type="text" id="txtCompanyName" value={this.state.lastName} onChange={(e) => this.handleLastNameChange(e.target.value)} /><br></br>
                <label>Date of birth</label><br></br>
                <input type="text" id="txtPrice" value={this.state.dateOfBirth} onChange={(e) => this.handleDobChange(e.target.value)} /><br></br>
                <label>Phone</label><br></br>
                <input type="text" id="txtQuantity" value={this.state.phone} onChange={(e) => this.handlePhoneChange(e.target.value)} /><br></br>
                <label>Address</label><br></br>
                <input type="text" id="txtDescription" value={this.state.address} onChange={(e) => this.handleAddressChange(e.target.value)} /><br></br>
                <label>Funds</label><br></br>
                <input type="text" id="txtUses" value={this.state.funds} onChange={(e) => this.handleFundsChange(e.target.value)} /><br></br>
                <Link to="/">
                    <button onClick={() => this.handleSave()}> Save </button>
                </Link>
            </Fragment>
        );
    }
}