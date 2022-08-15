 //SPDX-License-Identifier: MIT
 pragma solidity ^0.8.0;

import "./Item.sol";
import "./Ownable.sol";


 contract ItemManager is Ownable{
    enum SupplyChainSteps{Created,Paid,Delivered}

    struct S_Item {
        Item item;
        string identifier;
        uint priceInWei;
        ItemManager.SupplyChainSteps step;
    }

    mapping(uint => S_Item) public items;
    uint index;

    event SupplyChainStep(uint itemIndex , uint step , address _address);



    function createItem(string memory _identidier,uint _priceInWei) public onlyOwner {
      Item _item = new Item(this,_priceInWei,index);
      items[index].item = _item ;
       items[index].identifier = _identidier;
       items[index].priceInWei = _priceInWei;
       items[index].step = SupplyChainSteps.Created;
       emit SupplyChainStep(index,uint(items[index].step),address(_item));
       index++;
    }



    function triggerPayment(uint _index) public payable {
      Item _item = items[_index].item;
      require(address(_item) == msg.sender,"Only items are allowed to update themselves");
      require(items[_index].priceInWei <= msg.value, "Not fully paid");
      require(items[_index].step == SupplyChainSteps.Created , "Item is further in the supply chain ");
      items[_index].step = SupplyChainSteps.Paid;
      emit SupplyChainStep(_index,uint(items[_index].step),address(_item));
    }


    function triggerDelivery(uint _index) public onlyOwner{
  require(items[_index].step == SupplyChainSteps.Paid , "Item is further in the supply chain ");
      items[_index].step = SupplyChainSteps.Delivered;
      emit SupplyChainStep(_index,uint(items[_index].step), address(items[_index].item));
    }
 }