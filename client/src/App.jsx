import { EthProvider } from "./contexts/EthContext";
import Demo from "./Demo";

import "./App.css";
import Header from "./Demo/Header";

function App() {
  return (
    <EthProvider>
      <div id="App" style={{display:"flex",flexDirection:"column"}} >
      
         <Header/>
       
          <Demo />
          
        </div>
      
    </EthProvider>
  );
}

export default App;
