import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async (artifact ,artifact1 )=> {
      if (artifact) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const { abi } = artifact;
        let address, contract , address1,contract1;
        try {
          address = 
           artifact.networks[networkID].address;
          address1 = artifact1.networks[networkID]?.address;
          contract = new web3.eth.Contract(abi, address);
          contract1 = new web3.eth.Contract(artifact1?.abi,address1);
          // listenToPayments(contract)
        } catch (err) {
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: { artifact,artifact1 ,web3, accounts, networkID, contract,contract1 }
        });
      }
    }, []);
  // const listenToPayments =  (contract) =>{
  //     contract.events.SupplyChainStep().on("data",async (evt) =>{
   
  //         try {
  //           console.log(evt);
  //           const item = await contract.methods.items(evt.returnValues.itemIndex).call();
  //         console.log(item);
  //         if(evt.returnValues.step === 1){
  //         alert(`Item ${item.identifier} was paid,deliver it now!`);
  //         }
          
  //         } catch (error) {
  //           console.log(error);
  //         }
          
       
  //     });
  //   }
  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifact = require("../../contracts/ItemManager.json");
        const artifact1 = require("../../contracts/Item.json")
        init(artifact,artifact1 );
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init,state.contract]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact,state.artifact1);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact,state.artifact1]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
