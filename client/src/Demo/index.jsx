
import useEth from "../contexts/EthContext/useEth";
import ContractBtns from "./ContractBtns";

import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";

function Demo() {
  const { state } = useEth();


  return (
    <div>
      {
        !state.artifact ? <NoticeNoArtifact /> :
          !state.contract ? <NoticeWrongNetwork /> :
           <ContractBtns />
      }
    </div>
  )
}

export default Demo;
