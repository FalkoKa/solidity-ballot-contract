import { ethers } from 'ethers';
import { Ballot, Ballot__factory } from '../typechain-types';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  // Receiving parameters
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error('Parameters not provided');
  const contractAddress = parameters[0];
  const voterAddress = parameters[1];

  // Configuring the provider
  const provider = new ethers.JsonRpcProvider(
    process.env.RPC_ENDPOINT_URL ?? ''
  );

  // Configuring the wallet
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', provider);

  // Attaching the smart contract using Typechain
  const ballotFactory = new Ballot__factory(wallet);
  const ballotContract = ballotFactory.attach(contractAddress) as Ballot;
  const voter = await ballotContract.voters(voterAddress);

  if (!voter) {
    throw new Error('This address is not a voter');
  }

  console.log(
    `${voterAddress} ${voter.voted ? 'Has voted' : 'Has not voted yet'}`
  );

  console.log(`${voterAddress} voted ${voter.vote}`);

  console.log(`${voterAddress} has a voting weight of ${voter.weight}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
