import { useParams, useNavigate } from "react-router-dom";
import { useRecoilStateLoadable, useRecoilValueLoadable } from "recoil";
import { getBaseApi } from "../../configuration";
import { CallRecordHistory } from "../../state/whatsapp-state";
import { useEffect } from "react";
import { recordHistory } from "../../service/whatsapp";

const HistoryView = () => {
  let { id } = useParams();

  //const [callData, setCallData] = useRecoilStateLoadable(CallRecordHistory(id))

  const callData = useRecoilValueLoadable(CallRecordHistory(id));

  useEffect(() => {
    //recordHistory(id);
    // currentState changed.
    // save the current state
    // callData = useRecoilStateLoadable(CallRecordHistory(id))
    // console.log('call data', navigate);
    //  navigate;
    //setUserName(id);
  }, [recordHistory]);

  //

  console.log(callData);

  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">Record History</h2>
      </div>

      <div className="box grid grid-cols-4 gap-4 mt-5 p-5">
        {callData.state == "hasValue" &&
          callData.contents.map((file, key) => {
            return (
              <div key={key} className="inbox">
                <video width="320" height="240" controls>
                  <source
                    src={getBaseApi() + "file/" + file.file_path}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default HistoryView;
