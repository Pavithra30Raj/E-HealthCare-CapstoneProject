import React, { Component } from 'react';

export class GetMe extends Component {
    static displayName = GetMe.name;

    constructor(props) {
        super(props);
        this.state = { users: [], loading: true };
    }

    componentDidMount() {
        this.populateUserData();
    }

    static renderUsersTable(users) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>User Email</th>
                        <th>User Role</th>
                    </tr>
                </thead>
                <tbody>
                    <tr key={users.userId}>
                        <td>{users.userId}</td>
                        <td>{users.userName}</td>
                        <td>{users.userRole}</td>
                    </tr>
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : GetMe.renderUsersTable(this.state.users);

        return (
            <div>
                <h1 id="tabelLabel" >User details</h1>
                {contents}
            </div>
        );
    }

    async populateUserData() {
        let token = sessionStorage.getItem("token");
        console.log(token);
        const response = await fetch('GetMe', {
            method: 'GET',
            headers: {
                'Authorization': "bearer " + token
            },
        });
        const data = await response.json();
        this.setState({ users: data, loading: false });
    }
}
