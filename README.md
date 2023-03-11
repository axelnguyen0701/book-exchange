# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
FOR GRAPH DEVELOPMENT LOCALLY:

follow the steps in `https://github.com/graphprotocol/hardhat-graph`

Note: you will need to have Docker installed with `brew install --cask docker`

Recap of steps: 
1. run `npx hardhat node --hostname 0.0.0.0`
2. run `npx hardhat run --network localhost scripts/deploy.js`
3. in the generated ./subgraph directory, change subgraph.yml network to 'localhost'
4. add `POSTGRES_INITDB_ARGS: '--encoding=UTF-8 --lc-collate=C --lc-ctype=C'` in `docker-compose.yml` under env. If you regenerate this file, it will need to be re-added. 
5. run `docker-compose up` in a new terminal window
6. run `yarn create-local` and `yarn deploy-local` to deploy the subgraph
7. interact with the subgraph
8. query the subgraph at `http://127.0.0.1:8000/subgraphs/name/BookMarketplace/graphql`