import React, { Component } from 'react';

export class UserFetchData extends Component {
    static displayName = UserFetchData.name;

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
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user =>
                        <tr key={user.id}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.address}</td>
                            <td>{user.phone}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : UserFetchData.renderUsersTable(this.state.users);

        return (
            <div>
                <h1 id="tabelLabel" >Users list</h1>
                <p>This is a list of all users.</p>
                {contents}
            </div>
        );
    }

    async populateUserData() {
        const response = await fetch('Account/getAllUsers', {
            method: 'GET',
            headers: {
                'accept': 'text/plain',
                'Authorization': "bearer " + sessionStorage.getItem("token")
            },
        });
        const data = await response.json();
        console.log(data);
        this.setState({ users: data, loading: false });
    }
}
