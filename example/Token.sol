pragma solidity ^0.4.11;

contract Token {
  /* STATE  */
  uint public supply;
  string public name;
  string public ticker;
  uint public decimal;

  mapping(address => uint) public balances;
  mapping(address => mapping(address => uint)) public approvals;

  event Transfer(address indexed _from, address indexed _to, uint _amount);
  event Approval(address _indexed _owner, address indexed _spender, address indexed _to, uint _amount);
  
}
