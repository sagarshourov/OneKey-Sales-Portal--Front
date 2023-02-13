import { Tippy, Checkbox, Lucide } from "@/base-components";
import { Link } from "react-router-dom";
import { CallRecordHistory } from "../../state/whatsapp-state";
import { useRecoilStateLoadable } from "recoil";
import { useParams } from "react-router-dom";
import { getBaseApi } from "../../configuration";

const HistoryView = () => {
  let { id } = useParams();

  const callData = useRecoilStateLoadable(CallRecordHistory(id));

  console.log(callData);

  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">Record History</h2>
      </div>

      <div className="box grid grid-cols-12 mt-5">
        {callData[0].state == "hasValue" &&
          callData[0].contents.map((file, key) => {
            return (
              <div
                key={key}
                className="inbox col-span-12 xl:col-span-8 2xl:col-span-10"
              >
                <div className="flex flex-wrap gap-y-3 items-center px-5 pt-5 border-b border-slate-200/60 dark:border-darkmode-400 mb-4 pb-5">
                  {/* <button className="btn btn-outline-secondary mr-2">
              <Lucide icon="Archive" className="w-4 h-4 mr-2" /> Select All
            </button> */}
                </div>

                <div className="px-5 pb-4 grid grid-cols-12 gap-3 sm:gap-6 border-b border-slate-200/60">
                  <div className="intro-y col-span-4 sm:col-span-4 md:col-span-4 2xl:col-span-4">
                    <div className="file box border-slate-200/60 dark:border-darkmode-400 shadow-none rounded-md px-5 pt-8 pb-5 px-3 sm:px-5 relative zoom-in">
                      <div className="absolute left-0 top-0 mt-3 ml-3">
                        {/* <input
                    className="form-check-input border border-slate-500"
                    type="checkbox"
                  /> */}
                      </div>

                      {/* <div className="w-3/5 file__icon file__icon--image mx-auto">
                        <div className="file__icon--image__preview image-fit">
                          <a
                            href="#"
                            className="w-3/5 file__icon file__icon--file mx-auto"
                          >
                            <div className="file__icon__file-name">Mp4</div>
                          </a>
                        </div>
                      </div> */}

                      <video width="320" height="240" controls>
                        <source src={getBaseApi()+'file/'+file.file_path} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </div>
                <div className="p-5 flex flex-col sm:flex-row items-center text-center sm:text-left text-slate-500"></div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default HistoryView;
