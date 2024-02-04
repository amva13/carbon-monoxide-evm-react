# Getting Started with Computational Chemistry Experiments Performed on Solana via Neon EVM
This dApp is in development. This repo is part of my submission to [Encode Hackathon](https://www.encode.club/encodesolanahack).\n
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
We perform a simulation of carbon monoxide molecule vibrations via a Solidity Smart Contract.
A run of 10 timesteps is exposed as a function in the smart contract and invoked from the React Web App code.
The 3dMol library is used to visualize the vibrations.
To scale this computational chemistry engine in the long term, we wish to deploy as a Solana Program for on-chain computations.
This capability is tested via using Neon Labs' Neon EVM, which allows for running Solidity Smart Contract code as Solana Programs on the Solana Blockchain.
This project is part of [Alphunt AI](https://alphunt.com/).

## Demo Video
[Demo](https://youtu.be/y6pNFLezhVM) 
Brief intro to Alphunt and a demo on this dApp.

## Resources
[Neon EVM](https://neonevm.org/)
[3dMol.js](https://3dmol.csb.pitt.edu/doc/)
[Computational Chemistry Experiments performed on blockchain paper](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8159212/)

## Learn more about Alphunt
Feel free to reach out at hi@alphunt.com
Follow us on [LinkedIn](https://www.linkedin.com/company/apliko-io)
[Website](https://alphunt.com/)

## Instructions to launch dApp

### Pre-requisites
[Install React](https://github.com/facebook/create-react-app)
[Install Truffle](https://trufflesuite.com/docs/truffle/how-to/install/)
[Configure Truffle for Neon EVM, Connect MetaMask to Neon Network, Airdrop Neon Tokens](https://docs.neonevm.org/docs/quick_start)

### Deploy smart contract locally
```
cd src/carbon-monoxide-evm
truffle develop
migrate
```
Make note of the contract address provided in console output.

### Launch React App
```
npm start
```
You can press the button in the webapp to run the demo simulation.

## (React default instructions for reference) Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
