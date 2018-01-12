import Blockchain from './blockchain'
import Balance from './balance'
export default class Client {
  public blockchain: Blockchain;
  public balance: Balance;
  
  constructor() {
    this.blockchain = null;
    this.balance = new Balance();
  }

}
