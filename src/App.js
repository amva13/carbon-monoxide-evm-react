import logo from './logo.svg';
import './App.css';

// web3
const { Web3 } = require('web3');

function App() {
  // TODO: this is local ganache address
  const contractAddress = "0x803024e63246Ba73fB88E3ec2859FEa60Ba91211"

  async function getSimOutput(){
    console.log("getting contract")
    const {contract, _} = await getContract()
    console.log("the contract is", contract)
    console.log("finished awaiting getting contract")
    // test get mock outputs
    let molList = [], bondList = []
    const {atoms, bonds} = await contract.methods.getSimOutput().call().then(
      (simOutput)=>{
        // parse results into molecule and bonds lists
        for(let i=0;i<(simOutput.length - 2)/5;i++){
          let start = i*5
          let radius =  simOutput[start], oMass = simOutput[start+1], cMass = simOutput[start+2], oV = simOutput[start+3], cV = simOutput[start+4]
          // use radius distance to compute coords of mol2
          console.log(radius,i)
          let radsqrt = Math.sqrt(Number(radius)) 
          let equid = Math.sqrt(radsqrt/3)
          let mol1 = {
            "name": 'carbon_'+i,
            "elem": 'carbon_'+i,
            "serial": 2*i,
            "mass_magnitude": Number(cMass),
            "positions": [
              0,
              0,
              0
            ]
            // TODO: check what to do with these...
            // "momenta": [],
            // "positions": [],
            // "residue_index": 0
          }
          let mol2 = {
            "name": 'oxygen_'+i,
            "elem": 'oxygen_'+i,
            "serial": 2*i+1,
            "mass_magnitude": Number(oMass),
            "positions": [
              equid,
              equid,
              equid
            ]
          }
          molList.push(mol1)
          molList.push(mol2)
          let bond = {
            "atom1_index": 2*i,
            "atom2_index": 2*i + 1,
            "bond_order": 3
          }
          bondList.push(bond)
        }
        console.log("done parsing")
        console.log(molList)
        console.log(bondList)
        return {"atoms": molList, "bonds": bondList}
      }
    )
    console.log("atoms", atoms)
    console.log("bonds", bonds)
    return {atoms, bonds}
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
    const messageContract = new web3.eth.Contract(messageContractABI, contractAddress);
    console.log("msg contract is", messageContract)
    return {contract: messageContract, web3: web3}
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
        <button onClick={getSimOutput}>Click this for sim output.</button>
      </header>
    </div>
  );
}

export default App;
