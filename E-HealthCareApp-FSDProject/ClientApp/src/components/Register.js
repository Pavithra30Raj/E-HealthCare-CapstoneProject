import React, { Component, Fragment } from 'react';
import { Navigate} from 'react-router-dom';

export class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            dob: "",
            phone: "",
            address: "",
            admin: 0,
            error: 0
        };
    }

    async handleSave() {
            console.log("Sending inserted data to backend.");
            let data = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                password: this.state.password,
                dateOfBirth: this.state.dob,
                phone: this.state.phone,
                address: this.state.address,
                admin: this.state.admin
            }
            let url = "/Auth/register";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'accept': 'text/plain',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response;
            console.log(result.status);
            this.setState({ error: result.status })
    }

    handleFirstNameChange = (value) => {
        this.setState({ firstName: value });
    }
    handleLastNameChange = (value) => {
        this.setState({ lastName: value });
    }
    handleEmailChange = (value) => {
        this.setState({ email: value });
    }
    handlePasswordChange = (value) => {
        this.setState({ password: value });
    }
    handleDoBChange = (value) => {
        this.setState({ dob: value });
    }
    handlePhoneChange = (value) => {
        this.setState({ phone: value });
    }
    handleAddressChange = (value) => {
        this.setState({ address: value });
    }

    render() {
        let content;
        if (this.state.error == 400) {
            content = <p><em>Something went wrong.</em></p>;
        }
        else if (this.state.error != 0) {
            content = <Navigate to="/login" />;
        }

        return (
            <Fragment>
                <h1>Register</h1>
                { content }
                <label>First name</label><br></br>
                <input type="text" id="txtFirstName" placeholder='Enter First Name' onChange={(e) => this.handleFirstNameChange(e.target.value)} /><br></br>
                <label>Last name</label><br></br>
                <input type="text" id="txtLastName" placeholder='Enter Last Name' onChange={(e) => this.handleLastNameChange(e.target.value)} /><br></br>
                <label>Email</label><br></br>
                <input type="text" id="txtEmail" placeholder='Enter Email' onChange={(e) => this.handleEmailChange(e.target.value)} /><br></br>
                <label>Password</label><br></br>
                <input type="password" id="txtPass" placeholder='Enter Pasword' onChange={(e) => this.handlePasswordChange(e.target.value)} /><br></br>
                <label>Date of Birth</label><br></br>
                <input type="text" id="txtDoB" placeholder='Enter date of birth' onChange={(e) => this.handleDoBChange(e.target.value)} /><br></br>
                <label>Phone number</label><br></br>
                <input type="text" id="txtPhone" placeholder='Enter Phone Number' onChange={(e) => this.handlePhoneChange(e.target.value)} /><br></br>
                <label>Address</label><br></br>
                <input type="text" id="txtAddress" placeholder='Enter Address' onChange={(e) => this.handleAddressChange(e.target.value)} /><br></br>
                <button onClick={() => this.handleSave()}> Save </button>
            </Fragment>
        );
    }
}