import logo from './logo.svg';
import './App.css';

// web3
const { Web3 } = require('web3');

function App() {
  // TODO: this is local ganache address
  const contractAddress = "0x34C4C006b6a8635697356df4876006658eC70506"

  async function getSimOutput(){
    console.log("getting contract")
    const {messageContract, _} = await getContract()
    console.log("the message contract is", messageContract)
    const contract = messageContract
    console.log("the contract is", contract)
    console.log("finished awaiting getting contract")
    // test get mock outputs
    await contract.methods.getSimOutput().call().then(console.log)
    console.log("finished call to getSimOutput")
  }

  async function getContract() {
    const {web3, accounts} = await getWeb3();
    console.log("web3 is", web3)
    // fetch artifact
    const messageContractArtifact = require('./carbon-monoxide-evm/build/contracts/DiatomicMD');
    const messageContractABI = messageContractArtifact.abi;
    console.log(messageContractABI)
    // instantiate contract object
    // console.log("getting account to append to contract")
    // const account = accounts[0]
    // console.log("account when getting contract is", account)
    const messageContract = new web3.eth.Contract(messageContractABI, contractAddress, "0x34FAC91C4e7082C2f85ea6928DD7c21beeBBcfAb");
    console.log("msg contract is", messageContract)
    return {messageContract: messageContract, web3: web3}
  }

  async function getWeb3() {
    console.log("ran getWeb3")
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    let web3
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
      console.log("ran new web3 method")
        // Request account access if needed
        await window.ethereum.enable();
        // Accounts now exposed
      } catch (error) {
        console.error(error);
      }
    }

    // Legacy dapp browsers...
    else if (window.web3) {
      // Use MetaMask/Mist's provider.
      console.log("running legacy block for web3")
      web3 = window.web3;
      console.log('Injected web3 detected.');
    }
    // Fallback to localhost; use dev console port by default...
    else {
    console.log("running default local block for web3")
      const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
      web3 = new Web3(provider);
      console.log('No web3 instance injected, using Local web3.');
    }
    // accounts not needed here
    // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const accounts = "" // TODO: change
    // console.log("retreived accounts", accounts)
    return {web3: web3, accounts: accounts}
};


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={getSimOutput}>Click this for sim output.</button>
      </header>
    </div>
  );
}

export default App;
