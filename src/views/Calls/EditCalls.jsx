
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilRefresher_UNSTABLE, useSetRecoilState, useRecoilStateLoadable } from "recoil";
import {
  singleCallState,
  callIdState
} from "../../state/admin-atom";

//Plus


import EditCallCon from "./EditCallCon";



const EditCalls = (props) => {
  let { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [singleCall, setSingleCallState] = useRecoilStateLoadable(singleCallState);
  const setCallId = useSetRecoilState(callIdState);


    const resetSingleCall = useRecoilRefresher_UNSTABLE(singleCallState);
    //const resetcallIdState = useResetRecoilState(callIdState);
  useEffect(() => {
    //console.log("set state");
    setCallId(id);
    return () => {
      resetSingleCall();
      //resetcallIdState();
      //console.log("cleaned up");
    };
  }, [id]);


  //console.log('singleCall', singleCall);



  return (
    <>
      <h2 className="intro-y text-lg font-medium mt-10 ">Edit Calls</h2>

      {singleCall.state == "hasValue" ?
        <EditCallCon calls={singleCall.contents} setCallId={setCallId} setSingleCallState={setSingleCallState}/> //need to set up single call state
        : <p>Loading ...</p>}


    </>
  );
};

export default EditCalls;
