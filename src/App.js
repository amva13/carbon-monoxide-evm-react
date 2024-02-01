import logo from './logo.svg';
import './App.css';

// web3
const { Web3 } = require('web3');

function App() {
  // TODO: this is local ganache address
  const contractAddress = "0x34C4C006b6a8635697356df4876006658eC70506"

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
        const timesteps = Number(simOutput[simOutput.length - 2])
        const numValues = Number(simOutput[simOutput.length - 1])
        const numBondsSimulated = 2
        const stepSize = 2*numBondsSimulated
        console.log("simoutput length", simOutput.length, "numvalues", numValues)
        for(let i=0;i<(simOutput.length - 2)/numValues;i++){
          console.log("looped at i=",i)
          let start = i*numValues
          let bondLengthEq =  simOutput[start], oMass = simOutput[start+1], cMass = simOutput[start+2], oV = simOutput[start+3], cV = simOutput[start+4], bondLengthInit = simOutput[start+5]
          // use radius distance to compute coords of mol2
          let radsqrt = Math.sqrt(Number(bondLengthEq)) 
          console.log(radsqrt, i)
          let equid = Math.sqrt(radsqrt/3)
          let radsqrtInit = Math.sqrt(Number(bondLengthInit))
          console.log(radsqrtInit, i)
          let equidInit = Math.sqrt(radsqrtInit/3)
          let mol1 = {
            "name": 'carbon_'+i,
            "elem": 'carbon_'+i,
            "serial": stepSize*i,
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
            "serial": stepSize*i+1,
            "mass_magnitude": Number(oMass),
            "positions": [
              equid,
              equid,
              equid
            ]
          }
          let mol3 = {
            ...mol2,
            "positions": [
              mol1.positions[0]+equidInit,
              mol1.positions[1]+equidInit,
              mol1.positions[2]+equidInit
            ],
            "serial": mol2.serial+1,
            "name": mol2.name+"-"+"nonEq",
            "elem": mol2.name+"-"+"nonEq"
          }
          let mol4 =  {
            ...mol1,
            "name": mol1.name + "-" + "nonEq",
            "elem": mol1.name + "-" + "nonEq",
            "serial": mol3.serial + 1
          }
          molList.push(mol1)
          molList.push(mol2)
          molList.push(mol3)
          molList.push(mol4)
          let bond = {
            "atom1_index": mol1.serial,
            "atom2_index": mol2.serial,
            "bond_order": 3
          }
          let bondNonEq = {
            ...bond,
            "atom1_index": mol4.serial,
            "atom2_index": mol3.serial
          }
          bondList.push(bond)
          bondList.push(bondNonEq)
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
