import Blockchain from './blockchain'
import State from './state'
export default class Client {
  public blockchain: Blockchain;
  public state: State;
  
  constructor() {
    this.blockchain = null;
    this.state = new State();
  }

}
