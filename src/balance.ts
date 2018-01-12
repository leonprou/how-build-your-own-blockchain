import { Dictionary } from "typescript-collections";
import Address from './address'
import Transaction from './transaction'

export default class Balance {
  public accounts: Dictionary<Address, number>;

  constructor() {
    this.accounts = new Dictionary<Address, number>();
  }

  public apply(transaction: Transaction) {
     this.verify(transaction)
     const senderBalance = this.accounts.getValue(transaction.senderAddress)
     const recipientBalance = this.accounts.getValue(transaction.recipientAddress)
     this.accounts.setValue(transaction.senderAddress, senderBalance - transaction.value)
     this.accounts.setValue(transaction.recipientAddress, recipientBalance + transaction.value)
  }

  public verify(transaction: Transaction) {
     const senderBalance = this.accounts.getValue(transaction.senderAddress)
     const recipientBalance = this.accounts.getValue(transaction.recipientAddress)
     if (senderBalance === null || typeof senderBalance === 'undefined') {
       throw new Error(`sender address {transaction.senderAddress} does not exists`) 
     }
     if (recipientBalance === null || typeof recipientBalance === 'undefined') {
       throw new Error(`recipient address {transaction.recipientAddress} does not exists`) 
     }

     if (senderBalance < transaction.value) {
       throw new Error(`recipient address {transaction.recipientAddress} does not have enough funds`) 
     }
  }

}
