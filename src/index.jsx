import React from 'react';
import ReactDom from "react-dom";

import TodoApp from "./components/TodoApp";

const domContainer = document.getElementById("root");
const root = ReactDOM.createRoot(domContainer);
root.render(<TodoApp />);