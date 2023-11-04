import { ethers } from 'ethers';
import { Ballot, Ballot__factory } from '../typechain-types';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  // Receiving parameters
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 1)
    throw new Error('Parameters not provided');
  const contractAddress = parameters[0];

  // Configuring the provider
  const provider = new ethers.JsonRpcProvider(
    process.env.RPC_ENDPOINT_URL ?? ''
  );

  // Configuring the wallet
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', provider);

  // Attaching the smart contract using Typechain
  const ballotFactory = new Ballot__factory(wallet);
  const ballotContract = ballotFactory.attach(contractAddress) as Ballot;
  const winner = await ballotContract.winnerName();
  const winnerName = ethers.decodeBytes32String(winner);
  console.log(`The winning Proposal is ${winnerName}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
