import React, { Component } from 'react';
import { format, compareAsc, addDays, addMonths, addYears } from 'date-fns'
export class Reports extends Component {
    static displayName = Reports.name;

    constructor(props) {
        super(props);
        this.state = { content: [], loading: true, use: "ALL", totalSold: 0, pressed: 0, error: 0 };
    }

    render() {
        let content;
        if (this.state.pressed == 1) {
            content =
                <div>
                    <table className='table table-striped' aria-labelledby="tabelLabel">
                        <thead>
                            <tr>
                                <th>Ordered products</th>
                                <th>Total order value</th>
                                <th>Submission date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.content.map(data =>
                                    <tr key={data.id}>
                                        <td>{data.productNames}</td>
                                        <td>{data.totalPrice}</td>
                                        <td>{data.dateTime}</td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>
        } else if (this.state.pressed == 2) {
            content =
                <div>
                    <p> Total value of sales is: { this.state.totalSold }</p>
                </div>
        } else if (this.state.pressed == 3) {
            content =
                <div>
                    <table className='table table-striped' aria-labelledby="tabelLabel">
                        <thead>
                            <tr>
                                <th>Product name</th>
                                <th>Number of product in carts</th>
                                <th>Total products value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.content.map(data =>
                                <tr key={data.name}>
                                    <td>{data.name}</td>
                                    <td>{data.quantity}</td>
                                    <td>{data.price}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

        } else if (this.state.pressed == 4) {
            content =
                <div>
                    <table className='table table-striped' aria-labelledby="tabelLabel">
                        <thead>
                            <tr>
                                <th>Product name</th>
                                <th>Units left in stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.content.map(data =>
                                <tr key={data.name}>
                                    <td>{data.name}</td>
                                    <td>{data.quantity}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
        }
        return (
            <div>
                <h1 id="tabelLabel" >Reports</h1>
                <div>
                    <button className="btn btn-primary" onClick={() => this.weeklyOrders()}> Weekly Orders </button>
                    <button className="btn btn-primary" onClick={() => this.monthlyOrders()}> Monthly Orders </button>
                    <button className="btn btn-primary" onClick={() => this.yearlyOrders()}> Yearly Orders </button>
                    <p></p>
                    <button className="btn btn-primary" onClick={() => this.weeklySales()}> Weekly Sales </button>
                    <button className="btn btn-primary" onClick={() => this.monthlySales()}> Monthly Sales </button>
                    <button className="btn btn-primary" onClick={() => this.yearlySales()}> Yearly Sales </button>
                    <p></p>
                    <button className="btn btn-primary" onClick={() => this.medicineCheck()}> Medicine Report </button>
                    <button className="btn btn-primary" onClick={() => this.stockCheck()}> Stock Report </button>
                </div>
                <br />
                { content }
                
            </div>
            );
    }

    async medicineCheck() {
        let error = 0;
        const getAllProducts = await fetch('/Cart/getAllCarts', {
            method: 'GET',
            headers: {
                'Authorization': "bearer " + sessionStorage.getItem("token")
            }
        }).then(response => {
            console.log(response.status);
            if (response.status >= 400) {
                console.log(response.status);
                throw new Error();
            }
            else {
                this.setState({ error: 0 });
                return response;
            }
        }).catch((e) => {
            console.log("Error");
            error = 1;
        });
        if (error == 0) {
            const data = await getAllProducts.json();
            console.log(data);
            this.setState({ content: data });
            console.log(this.state.content);
            this.setState({ pressed: 3 });
        }
    }

    async stockCheck() {
        let error = 0;
        const getAllProducts = await fetch('/Product/getAllProducts', {
            method: 'GET',
            headers: {
                'Authorization': "bearer " + sessionStorage.getItem("token")
            }
        }).then(response => {
            console.log(response.status);
            if (response.status >= 400) {
                console.log(response.status);
                throw new Error();
            }
            else {
                this.setState({ error: 0 });
                return response;
            }
        }).catch((e) => {
            console.log("Error");
            error = 1;
        });
        if (error == 0) {
            const data = await getAllProducts.json();
            console.log(data);
            this.setState({ content: data });
            console.log(this.state.content);
            this.setState({ pressed: 4 });
        }
    }

    async weeklyOrders() {
        let error = 0;
        const getAllProducts = await fetch('/Order/getAllOrders', {
            method: 'GET',
            headers: {
                'Authorization': "bearer " + sessionStorage.getItem("token")
            }
        }).then(response => {
            console.log(response.status);
            if (response.status >= 400) {
                console.log(response.status);
                throw new Error();
            }
            else {
                this.setState({ error: 0 });
                return response;
            }
        }).catch((e) => {
            console.log("Error");
            error = 1;
        });
        if (error == 0) {
            const data = await getAllProducts.json();
            console.log(data);
            this.state.content = [];

            for (let index = 0; index < data.length; index++) {
                console.log(data[index]);
                let date = new Date(data[index].dateTime.substring(0, 4), data[index].dateTime.substring(5, 7)-1, data[index].dateTime.substring(8, 10));
                let result = compareAsc(addDays(new Date(), -7), date);
                if (result == -1) {
                    data[index].dateTime = format(date, 'dd/MM/yyyy');
                    this.state.content.push(data[index]);
                }
            }
            console.log(this.state.content);
            this.setState({ pressed: 1 });
        }
    }

    async monthlyOrders() {
        let error = 0;
        const getAllProducts = await fetch('/Order/getAllOrders', {
            method: 'GET',
            headers: {
                'Authorization': "bearer " + sessionStorage.getItem("token")
            }
        }).then(response => {
            console.log(response.status);
            if (response.status >= 400) {
                console.log(response.status);
                throw new Error();
            }
            else {
                this.setState({ error: 0 });
                return response;
            }
        }).catch((e) => {
            console.log("Error");
            error = 1;
        });
        if (error == 0) {
            const data = await getAllProducts.json();
            console.log(data);
            this.state.content = [];

            for (let index = 0; index < data.length; index++) {
                console.log(data[index]);
                let date = new Date(data[index].dateTime.substring(0, 4), data[index].dateTime.substring(5, 7) - 1, data[index].dateTime.substring(8, 10));
                let result = compareAsc(addMonths(new Date(), -1), date);
                if (result == -1) {
                    data[index].dateTime = format(date, 'dd/MM/yyyy');
                    this.state.content.push(data[index]);
                }
            }
            console.log(this.state.content);
            this.setState({ pressed: 1 });
        }
    }

    async yearlyOrders() {
        let error = 0;
        const getAllProducts = await fetch('/Order/getAllOrders', {
            method: 'GET',
            headers: {
                'Authorization': "bearer " + sessionStorage.getItem("token")
            }
        }).then(response => {
            console.log(response.status);
            if (response.status >= 400) {
                console.log(response.status);
                throw new Error();
            }
            else {
                this.setState({ error: 0 });
                return response;
            }
        }).catch((e) => {
            console.log("Error");
            error = 1;
        });
        if (error == 0) {
            const data = await getAllProducts.json();
            console.log(data);
            this.state.content = [];

            for (let index = 0; index < data.length; index++) {
                console.log(data[index]);
                let date = new Date(data[index].dateTime.substring(0, 4), data[index].dateTime.substring(5, 7) - 1, data[index].dateTime.substring(8, 10));
                let result = compareAsc(addYears(new Date(), -1), date);
                if (result == -1) {
                    data[index].dateTime = format(date, 'dd/MM/yyyy');
                    this.state.content.push(data[index]);
                }
            }
            console.log(this.state.content);
            this.setState({ pressed: 1 });
        }
    }

    async weeklySales() {
        let error = 0;
        const getAllProducts = await fetch('/Order/getAllOrders', {
            method: 'GET',
            headers: {
                'Authorization': "bearer " + sessionStorage.getItem("token")
            }
        }).then(response => {
            console.log(response.status);
            if (response.status >= 400) {
                console.log(response.status);
                throw new Error();
            }
            else {
                this.setState({ error: 0 });
                return response;
            }
        }).catch((e) => {
            console.log("Error");
            error = 1;
        });
        if (error == 0) {
            const data = await getAllProducts.json();
            console.log(data);
            let income = 0;

            for (let index = 0; index < data.length; index++) {
                console.log(data[index]);
                let date = new Date(data[index].dateTime.substring(0, 4), data[index].dateTime.substring(5, 7) - 1, data[index].dateTime.substring(8, 10));
                let result = compareAsc(addDays(new Date(), -7), date);
                if (result == -1) {
                    data[index].dateTime = format(date, 'dd/MM/yyyy');
                    income += data[index].totalPrice;
                }
            }
            this.setState({ totalSold: income });
            console.log(this.state.totalSold);
            this.setState({ pressed: 2 });
        }
    }

    async monthlySales() {
        let error = 0;
        const getAllProducts = await fetch('/Order/getAllOrders', {
            method: 'GET',
            headers: {
                'Authorization': "bearer " + sessionStorage.getItem("token")
            }
        }).then(response => {
            console.log(response.status);
            if (response.status >= 400) {
                console.log(response.status);
                throw new Error();
            }
            else {
                this.setState({ error: 0 });
                return response;
            }
        }).catch((e) => {
            console.log("Error");
            error = 1;
        });
        if (error == 0) {
            const data = await getAllProducts.json();
            console.log(data);
            let income = 0;

            for (let index = 0; index < data.length; index++) {
                console.log(data[index]);
                let date = new Date(data[index].dateTime.substring(0, 4), data[index].dateTime.substring(5, 7) - 1, data[index].dateTime.substring(8, 10));
                let result = compareAsc(addMonths(new Date(), -1), date);
                if (result == -1) {
                    data[index].dateTime = format(date, 'dd/MM/yyyy');
                    income += data[index].totalPrice;
                }
            }
            this.setState({ totalSold: income });
            console.log(this.state.totalSold);
            this.setState({ pressed: 2 });
        }
    }

    async yearlySales() {
        let error = 0;
        const getAllProducts = await fetch('/Order/getAllOrders', {
            method: 'GET',
            headers: {
                'Authorization': "bearer " + sessionStorage.getItem("token")
            }
        }).then(response => {
            console.log(response.status);
            if (response.status >= 400) {
                console.log(response.status);
                throw new Error();
            }
            else {
                this.setState({ error: 0 });
                return response;
            }
        }).catch((e) => {
            console.log("Error");
            error = 1;
        });
        if (error == 0) {
            const data = await getAllProducts.json();
            console.log(data);
            let income = 0;

            for (let index = 0; index < data.length; index++) {
                console.log(data[index]);
                let date = new Date(data[index].dateTime.substring(0, 4), data[index].dateTime.substring(5, 7) - 1, data[index].dateTime.substring(8, 10));
                let result = compareAsc(addYears(new Date(), -1), date);
                if (result == -1) {
                    data[index].dateTime = format(date, 'dd/MM/yyyy');
                    income += data[index].totalPrice;
                }
            }
            this.setState({ totalSold: income });
            console.log(this.state.totalSold);
            this.setState({ pressed: 2 });
        }
    }
}
