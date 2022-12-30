import React, { Component, Fragment } from 'react';
import { Navigate } from 'react-router-dom';
import { NavMenu } from './NavMenu';

export class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            error: 0
        };
    }

    async handleSave() {
            if (this.state.email != "" && this.state.password != "") {
                console.log("Sending inserted data to backend.");
                let data = {
                    email: this.state.email,
                    password: this.state.password
                }
                const response = await fetch("/Auth/login", {
                    method: 'POST',
                    headers: {
                        'accept': 'text/plain',
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const result = await response;
                console.log(result.status);
                this.setState({ error: result.status });
                if (result.status == 200) {
                    let token = await result.json();
                    console.log(token.token);
                    console.log(result.statusText);

                    console.log(token);

                    const getme = await fetch('/Auth/GetMe', {
                        method: 'GET',
                        headers: {
                            'Authorization': "bearer " + token.token
                        },
                    });
                    const data1 = await getme.json();
                    console.log(data1);

                    sessionStorage.setItem('token', token.token);
                    sessionStorage.setItem('name', data1.email);
                    sessionStorage.setItem('id', data1.id);
                    sessionStorage.setItem('role', data1.admin);

                    console.log(sessionStorage.getItem("name"));
                    console.log(sessionStorage.getItem("id"));
                    console.log(sessionStorage.getItem("role"));

                    sessionStorage.setItem('logged', 'yes');

                    window.location.reload(false);
                }
            }
        else {
            this.setState({ error: 400 });
        }
    }

    handleEmailChange = (value) => {
        this.setState({ email: value });
    }
    handlePasswordChange = (value) => {
        this.setState({ password: value });
    }

    render() {
        let content;
        if (this.state.error == 400) {
            content = <p><em>Wrong credentials.</em></p>;
        }
        else if (this.state.error != 0) {
            content = <Navigate to="/" />;
        }

        return (
            <Fragment>
                <div>Login</div>
                {content}
                <label>Email</label><br></br>
                <input type="email" id="txtEmail" placeholder='Enter Email' onChange={(e) => this.handleEmailChange(e.target.value)} /><br></br>
                <label>Password</label><br></br>
                <input type="password" id="txtPass" placeholder='Enter Pasword' onChange={(e) => this.handlePasswordChange(e.target.value)} /><br></br>
                <button onClick={() => this.handleSave()}> Login </button>
            </Fragment>
        );
    }
}