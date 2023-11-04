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
  const newVotingAddress = parameters[1];

  // Configuring the provider
  const provider = new ethers.JsonRpcProvider(
    process.env.RPC_ENDPOINT_URL ?? ''
  );

  // Configuring the wallet
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', provider);

  // Attaching the smart contract using Typechain
  const ballotFactory = new Ballot__factory(wallet);
  const ballotContract = ballotFactory.attach(contractAddress) as Ballot;

  try {
    const tx = await ballotContract.giveRightToVote(newVotingAddress);
    await tx.wait();
    const voter = await ballotContract.voters(newVotingAddress);

    if (voter.weight) {
      console.log('Address has right to vote now');
    } else {
      throw new Error('Something went wrong!');
    }
  } catch (error: any) {
    console.log(error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
