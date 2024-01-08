import React from "react";
import Game from "./components/Game";
import "./styles.css";

const App = () => {
  return (
    <div className="app">
      <Game />
    </div>
  );
};

import ReactDOM from "react-dom";

function main () {
    ReactDOM.render(<App />, document.getElementById("root"));
}

export default main
