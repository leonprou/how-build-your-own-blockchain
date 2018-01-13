import Address from './address';

export default class Account {
  public address: Address;
  public balance: number;
  public merkleRoot: string;
  

  constructor(address: Address, balance: number) {
    this.address = address;
    this.balance = balance;
    this.merkleRoot = null;
  }

}
