import logo from './logo.svg';
import './App.css';
import orbital from './orbital';

import Molecule3d from 'molecule-3d-for-react';
import { useState } from 'react';

// web3
const { Web3 } = require('web3');
// const molecule3dForReact = require('molecule-3d-for-react')
// var Molecule3d = molecule3dForReact.Molecule3d
console.log("imported component", Molecule3d)

const shapes = [{
  type: 'Arrow',
  color: '#00ff00',
  start: {
    x: 0,
    y: 0,
    z: -2.5,
  },
  end: {
    x: 0,
    y: 0,
    z: 3,
  },
}];
const labels = [
  {
    backgroundColor: '0x000000',
    backgroundOpacity: 1.0,
    borderColor: 'black',
    fontColor: '0xffffff',
    fontSize: 14,
    position: {
      x: 0,
      y: 0,
      z: 3,
    },
    text: 'I\'m a label',
  },
];

function App() {
  // TODO: this is local ganache address
  const contractAddress = "0x45B7637bD110980F213eeD95cd94c42986bdB8E5"

  // state vars
  const [atomsList, setAtomsList] = useState([]);
  const [bondsList, setBondsList] = useState([]);
  const [molReady, setMolReady] = useState(false);

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
        // const timesteps = Number(simOutput[simOutput.length - 2])
        // const numValues = Number(simOutput[simOutput.length - 1])
        // test... dummies
        const timesteps = 10
        const numValues = 6
        // dummies end...
        const numBondsSimulated = 2
        const stepSize = 2*numBondsSimulated
        console.log("simoutput length", simOutput.length, "numvalues", numValues, "timesteps", timesteps)
        for(let i=0;i<timesteps;i++){
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
          // momentum o
          let momentumO = oMass * oV
          momentumO = Number(momentumO)
          let mOSqrt = Math.sqrt(momentumO)
          let mOEqui = Math.sqrt(mOSqrt/3)
          //momentum c
          let momentumC = cMass * cV
          momentumC = Number(momentumC)
          let mCSqrt = Math.sqrt(momentumC)
          let mCEqui = Math.sqrt(mCSqrt/3)
          let mol1 = {
            "name": 'carbon_'+i,
            "elem": 'carbon_'+i,
            "serial": stepSize*i,
            "mass_magnitude": Number(cMass),
            "positions": [
              0,
              0,
              0
            ],
            "residue_index": 0,
            momenta: [
              mCEqui,
              mCEqui,
              mCEqui,
            ]
            // TODO: check what to do with these...
            // "momenta": [],
            // "positions": [],
            // "residue_index": 0
          }
          let mol2 = {
            ...mol1,
            "name": 'oxygen_'+i,
            "elem": 'oxygen_'+i,
            "serial": stepSize*i+1,
            "mass_magnitude": Number(oMass),
            "positions": [
              equid,
              equid,
              equid
            ],
            momenta: [
              mOEqui,
              mOEqui,
              mOEqui 
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
        setAtomsList(molList)
        setBondsList(bondList)
        return {"atoms": molList, "bonds": bondList}
      }
    )
    console.log("atoms", atoms)
    console.log("bonds", bonds)

    // set state variables
    setAtomsList(atoms)
    setBondsList(bonds)
    console.log("set state vars")
    console.log("test atoms")
    console.log(atomsList)
    setMolReady(true)
    console.log("set molReady")
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

function GetMol(){
  if(molReady){
    return (<Molecule3d
        modelData={{
          atoms: atomsList,
          bonds: bondsList,
        }}
      />)
  } else{
    return null; // wait until mol is ready before calling this function
  }
}

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={getSimOutput}>Click this for sim output.</button>
        {/* <GetMol />  */}
        <Molecule3d
          modelData={{
          atoms: atomsList,
          bonds: bondsList,
          selectedAtomIds: [0,1,2,3,4,5],
          shapes: shapes,
          labels: labels,
          orbital: orbital,
        }}
      />
        {/* <div style={{height: 400, width: 400}} className='viewer_3Dmoljs' data-pdb='2POR' data-backgroundcolor='0xffffff' data-style='stick' data-ui='true'></div> */}
        {/* <iframe style={{width: 500, height: 300}} frameborder="0" src="https://embed.molview.org/v1/?mode=balls&smiles=C%23O"></iframe> */}
      </header>

    </div>
  );
}

export default App;
