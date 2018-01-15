import { Dictionary } from "typescript-collections";
import * as fs from "fs";
import * as path from "path";
import { serialize, deserialize } from "serializer.ts/Serializer";
import Address from './address'
import Transaction from './transaction'
import Block from './block'
import Blockchain from './blockchain'

export default class State {
  public accounts: Dictionary<Address, number>;
  public storagePath: string;
  public nodeId: string;

  constructor(nodeId) {
    this.nodeId = nodeId
    this.accounts = new Dictionary<Address, number>();
    this.accounts.setValue("Alice", 1000);
    this.storagePath = path.resolve(__dirname, "../", `${this.nodeId}.state`);
  }

  public apply(transaction: Transaction) {
     this.verify(transaction);
     const senderState = this.accounts.getValue(transaction.senderAddress);
     const recipientState = this.accounts.getValue(transaction.recipientAddress) || 0;
     this.accounts.setValue(transaction.senderAddress, senderState - transaction.value);
     this.accounts.setValue(transaction.recipientAddress, recipientState + transaction.value);
  }

  public verify(transaction: Transaction) {
     const senderState = this.accounts.getValue(transaction.senderAddress);
     const recipientState = this.accounts.getValue(transaction.recipientAddress);
     if (senderState === null || typeof senderState === 'undefined') {
       throw new Error(`sender address ${transaction.senderAddress} does not exists`); 
     }
     if (senderState < transaction.value) {
       throw new Error(`sender address ${transaction.recipientAddress} does not have enough funds`);
     }
  }

  public applyBlock(block: Block) {
    for (let transaction of block.transactions) {
      this.apply(transaction)
    }

  public save() {
    fs.writeFileSync(this.storagePath, JSON.stringify(serialize(this.accounts)), "utf8");
  }
}

export function fromBlockchain(blockchain: Blockchain): State {
  const state = new State(blockchain.nodeId);
  for (let block of blockchain.blocks) {
    state.applyBlock(block);
  }
  return state;
}
