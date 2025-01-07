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

module.exports = {
    addCandidate,
    getCandidateInfo,
    vote,
    getWinner
};
