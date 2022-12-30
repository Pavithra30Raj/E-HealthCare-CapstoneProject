import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { expect } from "chai";
var jsdom = require("mocha-jsdom");

global.document = jsdom({
    url: "http://localhost:3000/"
});

import Register from "../components/Register.js"

let rootContainer;

beforeEach(() => {
    rootContainer = document.createElement("div");
    document.body.appendChild(rootContainer);
});

afterEach(() => {
    document.body.removeChild(rootContainer);
    rootContainer = null;
});

describe("App Component Testing", () => {
    it("Renders Hello World Title", () => {
        act(() => {
            ReactDOM.render(<Register />, rootContainer);
        });
        const h1 = rootContainer.querySelector("h1");
        expect(h1.textContent).to.equal("Register");
    });
});