import { sha256 } from "js-sha256";
import Transaction from "./transaction";
import Balance from "./balance";
import { serialize, deserialize } from "serializer.ts/Serializer";

export default class Block {
  public blockNumber: number;
  public transactions: Array<Transaction>;
  public timestamp: number;
  public nonce: number;
  public prevBlock: string;
  public balance: Balance;

  constructor(blockNumber: number, transactions: Array<Transaction>, balance: Balance, timestamp: number, nonce: number,
    prevBlock: string) {
    this.blockNumber = blockNumber;
    this.transactions = transactions;
    this.balance = balance;
    this.timestamp = timestamp;
    this.nonce = nonce;
    this.prevBlock = prevBlock;
  }

  // Calculates the SHA256 of the entire block, including its transactions.
  public sha256(): string {
    return sha256(JSON.stringify(serialize<Block>(this)));
  }
}

