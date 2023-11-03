import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Ballot } from '../typechain-types';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

const PROPOSALS = ['Proposal 1', 'Proposal 2', 'Proposal 3'];

async function deployContract() {
  const signers = await ethers.getSigners();
  const ballotFactory = await ethers.getContractFactory('Ballot');
  const proposals = PROPOSALS.map(ethers.encodeBytes32String);
  const ballotContract = await ballotFactory.deploy(proposals);
  await ballotContract.waitForDeployment();

  return { ballotContract, signers };
}

describe('Ballot', async () => {
  describe('when the contract is deployed', async () => {
    it('has the provided proposals', async () => {
      const { ballotContract, signers } = await loadFixture(deployContract);
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(ethers.decodeBytes32String(proposal.name)).to.eq(
          PROPOSALS[index]
        );
      }
    });

    it('has zero votes for all proposals', async () => {
      const { ballotContract } = await loadFixture(deployContract);
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(proposal.voteCount).to.eq(0);
      }
    });

    it('sets the deployer address as chairperson', async () => {
      const { ballotContract, signers } = await loadFixture(deployContract);
      const deplyerAdress = signers[0].address;
      const chairpersonAdress = await ballotContract.chairperson();
      expect(deplyerAdress).to.eq(chairpersonAdress);
    });
    it('sets the voting weight for the chairperson as 1', async () => {
      const { ballotContract } = await loadFixture(deployContract);
      const chairpersonAddress = await ballotContract.chairperson();
      const chairpersonVoter = await ballotContract.voters(chairpersonAddress);
      expect(chairpersonVoter.weight).to.be.eq(1);
    });
  });

  describe('when the chairperson interacts with the giveRightToVote function in the contract', async () => {
    it('gives right to vote for another address', async () => {
      const { ballotContract, signers } = await loadFixture(deployContract);
      const tx = await ballotContract.giveRightToVote(signers[1].address);
      tx.wait();
      const voter = await ballotContract.voters(signers[1]);
      expect(voter.weight).to.be.eq(1);
    });
    it('can not give right to vote for someone that has voted', async () => {
      const { ballotContract, signers } = await loadFixture(deployContract);
      const tx = await ballotContract.giveRightToVote(signers[1].address);
      tx.wait();
      const proposal = await ballotContract.proposals(1);
      const voteTx = await ballotContract.connect(signers[1]).vote(0);
      voteTx.wait();
      expect(
        ballotContract.giveRightToVote(signers[1].address)
      ).to.be.rejectedWith('The voter already voted.');
    });
    it('can not give right to vote for someone that has already voting rights', async () => {
      const { ballotContract, signers } = await loadFixture(deployContract);
      await ballotContract.giveRightToVote(signers[1]);
      expect(ballotContract.giveRightToVote(signers[1])).to.be.rejected;
    });
  });

  describe('when the voter interacts with the vote function in the contract', async () => {
    it('should register the vote', async () => {
      const { ballotContract, signers } = await loadFixture(deployContract);
      await ballotContract.giveRightToVote(signers[1].address);
      const proposal = await ballotContract.proposals(0);
      const voteTx = await ballotContract.connect(signers[1]).vote(0);
      voteTx.wait();
      const voter = await ballotContract.voters(signers[1]);
      expect(voter.voted).to.be.true;
    });
  });

  describe('when the voter interacts with the delegate function in the contract', async () => {
    // TODO
    it('should transfer voting power', async () => {
      throw Error('Not implemented');
    });
  });

  describe('when an account other than the chairperson interacts with the giveRightToVote function in the contract', async () => {
    // TODO
    it('should revert', async () => {
      throw Error('Not implemented');
    });
  });

  describe('when an account without right to vote interacts with the vote function in the contract', async () => {
    // TODO
    it('should revert', async () => {
      throw Error('Not implemented');
    });
  });

  describe('when an account without right to vote interacts with the delegate function in the contract', async () => {
    // TODO
    it('should revert', async () => {
      throw Error('Not implemented');
    });
  });

  describe('when someone interacts with the winningProposal function before any votes are cast', async () => {
    // TODO
    it('should return 0', async () => {
      throw Error('Not implemented');
    });
  });

  describe('when someone interacts with the winningProposal function after one vote is cast for the first proposal', async () => {
    // TODO
    it('should return 0', async () => {
      throw Error('Not implemented');
    });
  });

  describe('when someone interacts with the winnerName function before any votes are cast', async () => {
    // TODO
    it('should return name of proposal 0', async () => {
      throw Error('Not implemented');
    });
  });

  describe('when someone interacts with the winnerName function after one vote is cast for the first proposal', async () => {
    // TODO
    it('should return name of proposal 0', async () => {
      throw Error('Not implemented');
    });
  });

  describe('when someone interacts with the winningProposal function and winnerName after 5 random votes are cast for the proposals', async () => {
    // TODO
    it('should return the name of the winner proposal', async () => {
      throw Error('Not implemented');
    });
  });
});
