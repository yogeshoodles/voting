const { ethers } = require("ethers");
require('dotenv').config();
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const contractAddress = process.env.CONTRACT_ADDR;
const contractABI = require("./contractABI.json");

const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

async function getCandidateInfo(id) {
    const data = await contract.candidates(id);
    return data;
}

async function addCandidate(value) {
    const tx = await contract.addCandidate(value);
    await tx.wait();
    return {"txn": tx.hash}
}

async function vote(id) {
    const tx = await contract.vote(id);
    await tx.wait();
    return {"txn": tx.hash}
}

async function getWinner() {
    const data = await contract.getWinner();
    return data;
}

async function getPastEvents() {
    const filter = {
      address: contractAddress,
      topics: [
        ethers.id("votedEvent(uint256)")
      ],
      fromBlock: 0,
      toBlock: "latest",
    };
  
    try {
      const logs = await provider.getLogs(filter);

      const parsedEvents = await Promise.all(logs.map(async (log) => {
        const parsedLog = contract.interface.parseLog(log);        
        const block = await provider.getBlock(log.blockNumber);
        return {
          eventName: parsedLog.name,
          args: parsedLog.args.toString(),
          transactionHash: log.transactionHash,
          blockNumber: log.blockNumber,
          blockTimestamp: block.timestamp,
          logIndex: log.index,
          eventSignature: log.topics,
        };
      }));
  
      return parsedEvents;
    } catch (error) {
      console.error("Error fetching or parsing events:", error);
      return [];
    }
}

module.exports = {
    addCandidate,
    getCandidateInfo,
    vote,
    getWinner,
    getPastEvents
};
