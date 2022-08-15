import {  useEffect, useState } from "react";
import useEth from "../contexts/EthContext/useEth";

function ContractBtns() {
   const [cost, setCost] = useState(0);
   const [itemName, setItemName] = useState("")
   const [itemAddress, setItemAddress] = useState(null);
   const [msg, setMsg] = useState("");
  const { state: { contract, accounts } } = useEth();
  useEffect(() => {
   listenToPayments()
  }, [contract])
  
    const handleSubmit=async()=>{
       if(cost !== 0 && itemName !== ""){
          try {
          const res =  await contract.methods.createItem(itemName,cost).send({from:accounts[0]});
          setItemAddress(res.events.SupplyChainStep.returnValues._address);
           return;
          // alert(`Send ${cost} wei to ${res.events.SupplyChainStep.returnValues._address}`);
          } catch (error) {
            console.log(error);
          }
       }else{
        alert("Please provide cost and name to create an item");
      return;
       }
    }
   const listenToPayments =  () =>{
      contract.events.SupplyChainStep().on("data",async (evt) =>{
         
          try {
            // console.log(evt);
            const item = await contract.methods.items(evt.returnValues.itemIndex).call();
            let step=item.step;
        step == 1 &&
            setMsg(`Item ${item.identifier} was paid,deliver it now!`)
           return;
          } catch (error) {
            console.log(error);
          }
        
       
      });
    }
   
  return (
   <div>
      <div className="form">
        {itemAddress ? <>
        <div style={{display:"flex",flexDirection:"column",textAlign:"center",justifyContent:"center",alignItems:"center"}}>
          {msg?<>
          <span>{msg}</span>
          </>:<>
          <span>Send {cost} wei To {itemAddress} for {itemName}</span>
          </>}
          <p>If alredy paid wait for conformation!!</p>
        <button type="button" onClick={()=>{
          setItemName("")
          setCost(0)
          setItemAddress(null)}}>
          Reset</button>
    </div>
        </>:<>
         <h3>Add Items</h3>
      <label 
      htmlFor="cost"
      >Cost In Wei</label>
       <input type="number" name="cost" value={cost} onChange={e=>setCost(e.target.value)}/>
      <label htmlFor="itemName">Item Name</label>
       <input type="text" name="itemName" placeholder="Example 1"
       value={itemName} onChange={e=>setItemName(e.target.value)}/>
       <button type="button" onClick={handleSubmit}>Create Item</button>
        </> }
       
        
      </div>
      
    </div>
  );
}

export default ContractBtns;
