import { Dictionary } from "typescript-collections";
import * as fs from "fs";
import * as path from "path";
import { serialize, deserialize } from "serializer.ts/Serializer";
import Address from './address'
import Transaction from './transaction'
import Block from './block'
import Blockchain from './blockchain'

export default class Balance {
  public accounts: Dictionary<Address, number>;
  public storagePath: string;
  public nodeId: string;

  constructor(nodeId) {
    this.nodeId = nodeId
    this.accounts = new Dictionary<Address, number>();
    this.accounts.setValue("Alice", 1000);
    this.storagePath = path.resolve(__dirname, "../", `${this.nodeId}.balance`);
  }

  public apply(transaction: Transaction) {
     this.verify(transaction);
     const senderBalance = this.accounts.getValue(transaction.senderAddress);
     const recipientBalance = this.accounts.getValue(transaction.recipientAddress) || 0;
     this.accounts.setValue(transaction.senderAddress, senderBalance - transaction.value);
     this.accounts.setValue(transaction.recipientAddress, recipientBalance + transaction.value);
  }

  public verify(transaction: Transaction) {
     const senderBalance = this.accounts.getValue(transaction.senderAddress);
     const recipientBalance = this.accounts.getValue(transaction.recipientAddress);
     if (senderBalance === null || typeof senderBalance === 'undefined') {
       throw new Error(`sender address ${transaction.senderAddress} does not exists`); 
     }
     if (senderBalance < transaction.value) {
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

export function fromBlockchain(blockchain: Blockchain): Balance {
  const balance = new Balance(blockchain.nodeId);
  for (let block of blockchain.blocks) {
    balance.applyBlock(block);
  }
  return balance;
}
