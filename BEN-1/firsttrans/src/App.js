import logo from './logo.svg';
import './App.css';
import { firstTransaction } from './bbginit';

function App() {

  const firstTransactionHandler = (event) => {
    console.log('btn clicked')
    firstTransaction()
    console.log('after creating transaction')
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and ball to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <button
          onClick={firstTransactionHandler}>
            First Transaction
        </button>

      </header>
    </div>
  );
}

export default App;
