import {
  Lucide,
  Modal,
  ModalBody,
  LoadingIcon,
  Litepicker,
} from "@/base-components";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useRecoilStateLoadable } from "recoil";
import { filter } from "lodash";
import {
  callListState,
  notiState,
  allUserListState,
} from "../../state/admin-atom";

//Plus

import axios from "axios";
import { adminApi } from "../../configuration";
import { helper } from "@/utils/helper";
import { loginState } from "../../state/login-atom";
import { settingState } from "../../state/setting-atom";
import FollowUpSection from "./FollowUpSection";
import ConfirmedGpa from "./ConfirmedGpa";

function employeeFilters(array) {
  return filter(array, (_items) => {
    return _items.is_admin == 3;
  });
}

function removeArr(array, index) {
  return filter(array, (_items, key) => {
    return _items.id !== index;
  });
}

const AddCalls = (props) => {
  let { id } = useParams();
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [callData, setCallState] = useRecoilState(callListState);
  const [userData, setUserState] = useRecoilStateLoadable(allUserListState);
  const [notiData, setNotiState] = useRecoilState(notiState);
  const logindata = useRecoilValue(loginState);

  const [firstContact, setFirstContact] = useState("");

  const [followdate, setFollowDate] = useState("");

  const [validationModal, setValidationModal] = useState(false);

  const [err, setErr] = useState([]);
  const [emailErr, setEmailErr] = useState([]);

  const [call, setCall] = useState([]);

  const [show, setShow] = useState(false);
  const setting = useRecoilValue(settingState);

  const [followUpState, sectFollowUpSec] = useState([
    {
      id: 0,
      values: [
        {
          value: "",
        },
        {
          value: "",
        },
        {
          value: "",
        },
        {
          value: "",
        },
        {
          value: "",
        },
      ],
    },
  ]);

  const [confirmGpaState, setConfirmGpaState] = useState([
    {
      id: 0,
      values: [
        {
          value: "",
        },
        {
          value: "",
        },
      ],
    },
  ]);

  const headers = {
    Authorization: `Bearer ${logindata?.token}`,
    ContentType: "application/json",
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    var data = new FormData(e.target);

    // data.append("follow_up_date", helper.formatDate(followdate, "YYYY-MM-DD"));
    data.append("first_contact", helper.formatDate(firstContact, "YYYY-MM-DD"));

    //data.append("last_status_date", lastStatus);

    data.append("user_id", logindata?.userId);

    const URL = adminApi() + "calls";

    setLoading(true);

    try {
      const response = await axios.post(URL, data, {
        headers,
      });
      //console.log(response);
      if (response?.data?.success) {
        setLoading(false);
        setCallState(response?.data?.data);
        navigate("../calls/all", { replace: true });
      }
    } catch (err) {
      if (!err?.response?.data?.success) {
        console.log("Err", err?.response?.data?.message.email[0]);

        if (
          err?.response?.data?.message.email &&
          err?.response?.data?.message.email[0] == "taken"
        ) {
          setCall(err?.response?.data?.data);

          setValidationModal(true);
        } else {
          setErr(err?.response?.data?.message);
        }
      }

      setLoading(false);
    }
  };

  const moveAdmin = async () => {
    const URL = adminApi() + "notifications";

    try {
      const response = await axios.post(
        URL,
        { type: 1, content: "Client Recovering Request", call_id: call?.id },
        {
          //user id is creator of notifications
          headers,
        }
      );
      //console.log(response);
      if (response?.data?.success) {
        setLoading(false);
        setValidationModal(false);
        setNotiState(response?.data?.data);
      }
    } catch (err) {
      if (!err?.response?.data?.success) {
      }

      setLoading(false);
    }
  };

  const showMe = () => {
    setShow(true);
  };

  const checkEmail = async (e) => {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(e.target.value)) {
      console.log("Invalid Email");
      setEmailErr(["Email is not valid !"]);
      return false;
    } else {
      setEmailErr([]);
    }

    const URL = adminApi() + "check/" + "email/" + e.target.value;

    try {
      const response = await axios.get(URL, {
        //user id is creator of notifications
        headers,
      });
    } catch (err) {
      console.log(err?.response?.data.message);

      if (err?.response?.data?.message?.email) {
        setEmailErr(err?.response?.data?.message?.email);
        setCall(err?.response?.data?.data);

        setValidationModal(true);
      }

      setLoading(false);
    }
  };

  const users = employeeFilters(userData.contents);

  const handelRadio = (e) => {
    if (e.target.value == 1) {
      document.getElementById(e.target.name).classList.remove("hidden");
    } else {
      document.getElementById(e.target.name).classList.add("hidden");
    }
  };

  const handelPackage = (e) => {
    let name = e.target.name;
    document.getElementById(name).classList.add("hidden");
    let value = e.target.value;
    if (value == 5) {
      document.getElementById(name).classList.remove("hidden");
    }
  };
  const onChange = (val, index, sec) => {
    let newAte = JSON.stringify(followUpState);
    let newState = JSON.parse(newAte);
    newState[index].values[sec].value = val;
    sectFollowUpSec(newState);
  };

  const onChangeGpa = (val, index, sec) => {
    let newAte = JSON.stringify(confirmGpaState);
    let newState = JSON.parse(newAte);
    newState[index].values[sec].value = val;
    setConfirmGpaState(newState);
  };

  const handelFollow = (e, index) => {
    //let name = e.target.name;
    let value = parseInt(e.target.value);
    //onChange(e.target.value, index, 1);
    if (value === 3 || value === 4) {
      let newObj = {
        id: followUpState[followUpState.length - 1].id + 1,
        values: [
          {
            value: "",
          },
          {
            value: "",
          },
          {
            value: "",
          },
          {
            value: "",
          },
          {
            value: "",
          },
        ],
      };
      let followUp = followUpState;
      followUp[index].values[1].value = value;
      sectFollowUpSec([...followUp, newObj]);
    } else {
      onChange(e.target.value, index, 1);
    }
  };

  const deleteFollowUp = (e) => {
    if (followUpState.length > 1) {
      let newArr = removeArr(followUpState, e);
      sectFollowUpSec(newArr);
    }
  };

  const deleteConGpa = (e) => {
    if (confirmGpaState.length > 1) {
      let newArr = removeArr(confirmGpaState, e);
      setConfirmGpaState(newArr);
    }
  };

  const addConGpa = (e) => {
    let newObj = {
      id: confirmGpaState[confirmGpaState.length - 1].id + 1,
      values: [
        {
          value: "",
        },
        {
          value: "",
        },
      ],
    };

    setConfirmGpaState([...confirmGpaState, newObj]);
  };

  return (
    <>
      <h2 className="intro-y text-lg font-medium mt-10 ">Add Calls</h2>

      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="mt-5">
          <div className="px-5">
            {Object.keys(err).length > 0 &&
              Object.values(err).map((text, key) => {
                return (
                  <h3 className="text-danger py-3 text-center" key={key}>
                    {text}
                  </h3>
                );
              })}
          </div>

          <div className="intro-y box p-5">
            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
              <div className="intro-x ">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  className="form-control"
                  placeholder=""
                />
              </div>
              <div className="intro-x ">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  className="form-control"
                  placeholder=""
                />
              </div>
              <div className="intro-x ">
                <label className="form-label">Email</label>
                <input
                  type="text"
                  name="email"
                  className={
                    emailErr.length > 0
                      ? "border-warning form-control "
                      : "form-control"
                  }
                  placeholder=""
                  required
                  onChange={(e) => checkEmail(e)}
                />

                {emailErr.length > 0 &&
                  emailErr.map((text, key) => {
                    return (
                      <small className="text-danger py-3 text-center" key={key}>
                        {text}
                      </small>
                    );
                  })}
              </div>
              <div className="intro-x ">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  className=" form-control"
                  placeholder=""
                />
              </div>
              <div className="intro-x ">
                <label className="form-label">Age</label>
                <input
                  type="text"
                  name="age"
                  className=" form-control"
                  placeholder=""
                />
              </div>
              <div className="intro-x ">
                <label className="form-label">GPA</label>
                <input
                  type="text"
                  name="gpa"
                  className=" form-control"
                  placeholder=""
                />
              </div>
              <div className="intro-x ">
                <label className="form-label">Priority</label>
                <select name="priority" className="form-control">
                  <option value="0">Select..</option>
                  {setting.priorities &&
                    setting.priorities.map((val, indx) => (
                      <option key={indx} value={val?.id}>
                        {val?.title}
                      </option>
                    ))}
                </select>
              </div>
              <div className="intro-x ">
                <label className="form-label">Referred by</label>
                <input
                  type="text"
                  name="referred_by"
                  className="form-control"
                  placeholder=""
                />
              </div>
            </div>
            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              <div className="intro-x ">
                <label className="form-label">Marital Status</label>

                <select name="marital_status" className="form-control">
                  <option value="0">Select...</option>
                  {setting.marital_status &&
                    setting.marital_status.map((val, indx) => (
                      <option key={indx} value={val?.id}>
                        {val?.title}
                      </option>
                    ))}
                </select>
              </div>
              <div className="intro-x ">
                <label className="form-label">Want to Study</label>
                <select name="want_to_study" className="form-control">
                  <option value="0">Select...</option>
                  {setting.want_to_study &&
                    setting.want_to_study.map((val, indx) => (
                      <option key={indx} value={val?.id}>
                        {val?.title}
                      </option>
                    ))}
                </select>
              </div>
              <div className="intro-x ">
                <label className="form-label">Assigned to</label>
                <select name="assigned_to" className="form-control">
                  <option value="0">Select...</option>

                  {userData.state == "hasValue" &&
                    users.map((val, index) => (
                      <option key={index}>{val.first_name}</option>
                    ))}
                </select>
              </div>
            </div>
            <div className="border border-dashed border-2 p-5 md:mt-5">
              <div className="grid grid-cols-1  gap-4">
                <div className="intro-y">
                  <label className="form-label">Memo</label>
                  <input
                    type="text"
                    name="memo"
                    className=" form-control"
                    placeholder=""
                  />
                </div>
              </div>
            </div>
          </div>

          {/*Section 1*/}

          <div className="intro-y box p-5 mt-5">
            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-5 gap-4 mt-5">
              <div className="intro-x ">
                <label className="form-label">First Contact Date</label>

                <div className="relative w-full">
                  <div className="absolute rounded-l w-10 h-full flex items-center justify-center bg-slate-100 border text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
                    <Lucide icon="Calendar" className="w-4 h-4" />
                  </div>
                  <Litepicker
                    value={firstContact == "" ? undefined : firstContact}
                    onChange={setFirstContact}
                    options={{
                      format: "MM/DD/YYYY",
                      autoApply: false,
                      showWeekNumbers: true,

                      dropdowns: {
                        minYear: 1990,
                        maxYear: 2030,
                        months: true,
                        years: true,
                      },
                    }}
                    className="form-control pl-12"
                  />
                </div>
              </div>
              <div className="intro-y  col-span-2">
                {confirmGpaState.map((val, indx) => (
                  <ConfirmedGpa
                    index={indx}
                    setting={setting}
                    data={val}
                    deleteConGpa={deleteConGpa}
                    onChange={onChangeGpa}
                    key={indx}
                  />
                ))}

                <div className="col-span-2 mt-5 flex  justify-center">
                  <a onClick={addConGpa} className=" btn btn-elevated-primary">
                    <Lucide icon="Plus" className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <div className="intro-x">
                <label className="form-label">Immigration Fillings </label>
                <div className="flex flex-col sm:flex-row mt-2">
                  <div className="form-check mr-2">
                    <input
                      onChange={(e) => handelRadio(e)}
                      className="form-check-input"
                      type="radio"
                      name="immigration_filling"
                      value="1"
                    />
                    <label className="form-check-label">Yes</label>
                  </div>
                  <div className="form-check mr-2 mt-2 sm:mt-0">
                    <input
                      onChange={(e) => handelRadio(e)}
                      className="form-check-input"
                      type="radio"
                      name="immigration_filling"
                      value="0"
                    />
                    <label className="form-check-label">No</label>
                  </div>
                </div>
                <input
                  id="immigration_filling"
                  type="text"
                  className="form-control mt-2 hidden"
                  placeholder="Method Of Filling"
                  name="method_filling"
                />
              </div>
              {/* <div className="intro-x">
                <label className="form-label">Method of Filling </label>
                <input type="text" name="method_filling" />
              </div> */}

              <div className="intro-x">
                <label className="form-label">Goal </label>
                <select name="goal" className="form-control">
                  <option value="0">Select...</option>
                  {setting.goal &&
                    setting.goal.map((val, indx) => (
                      <option key={indx} value={val?.id}>
                        {val?.title}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
              <div className="intro-y">
                <label className="form-label">Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  className=" form-control"
                  placeholder=""
                />
              </div>
              <div>
                <label className="form-label">Package</label>

                <select
                  onChange={(e) => handelPackage(e)}
                  name="package"
                  className="form-control"
                >
                  <option value="0">Select...</option>

                  {setting.packages &&
                    setting.packages.map((val, indx) => (
                      <option key={indx} value={val?.id}>
                        {val?.title}
                      </option>
                    ))}
                </select>

                <input
                  type="text"
                  id="package"
                  placeholder="Explain"
                  name="package_explain"
                  className="form-control hidden mt-2"
                />
              </div>

              <div>
                <label className="form-label">Status</label>

                <select name="status" className="form-control">
                  <option value="0">Select...</option>

                  {setting.status &&
                    setting.status.map((val, indx) => (
                      <option key={indx} value={val?.id}>
                        {val?.title}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="form-label">First Call Result</label>

                <select name="results" className="form-control">
                  <option value="0">Select...</option>

                  {setting.results &&
                    setting.results.map((val, indx) => (
                      <option key={indx} value={val?.id}>
                        {val?.title}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="border border-dashed border-2 p-5 md:mt-5">
              <div className="grid grid-cols-1  gap-4">
                <div className="intro-y">
                  <label className="form-label">Last Status Notes</label>
                  <input
                    type="text"
                    name="last_status_notes"
                    className=" form-control"
                    placeholder=""
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 mt-5 gap-4">
                <div className="intro-y">
                  <label className="form-label"> Agreement Sent</label>
                  <select name="agreement_sent" className="form-control">
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
                <div className="intro-y">
                  <label className="form-label">Date Agreement Sent</label>
                  <input
                    type="date"
                    name="agree_date_sent"
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            <div className="border mt-5 px-5 pb-5 border-dashed border-2">
              {followUpState.length > 0 &&
                followUpState.map((val, index) => (
                  <FollowUpSection
                    index={index}
                    key={index}
                    handelSelect={handelFollow}
                    setting={setting}
                    data={val}
                    deleteFollowUp={deleteFollowUp}
                    onChange={onChange}
                  />
                ))}
            </div>

            <div className="border border-dashed border-2 p-5 md:mt-5">
              <div className="grid grid-cols-1  gap-4">
                <div className="intro-y">
                  <label className="form-label">Feedback</label>
                  <input
                    type="text"
                    name="feedbacks"
                    className=" form-control"
                    placeholder=""
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
              <div className="intro-x ">
                <label className="form-label">Cancellation reason </label>
                <select name="cancel_reason" className="form-control">
                  <option value="0">Select...</option>
                  {setting.cancel_reason &&
                    setting.cancel_reason.map((val, indx) => (
                      <option key={indx} value={val?.id}>
                        {val?.title}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          <div className="intro-y col-span-12 flex items-center justify-center  mt-5">
            <button type="submit" className="btn btn-elevated-primary w-24">
              Save{" "}
              {loading && (
                <LoadingIcon
                  icon="three-dots"
                  color="white"
                  className="w-4 h-4 ml-2"
                />
              )}
            </button>
          </div>
        </div>
      </form>

      <Modal
        size="modal-lg"
        show={validationModal}
        onHidden={() => {
          setValidationModal(false);
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <div className="text-xl mt-3 text-danger bg-danger/20 border border-danger/20 rounded-md px-1.5 py-5 ml-1">
              User already exist !
            </div>
            <div className="my-5 ">
              {show ? (
                <div className="intro-y p-5 box grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    Name:
                    <span className="text-xs text-success bg-success/20 border border-success/20 rounded-md px-1.5 py-0.5 ml-1">
                      {call?.first_name} {call?.last_name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    E-mail:
                    <span className="text-xs text-success bg-success/20 border border-success/20 rounded-md px-1.5 py-0.5 ml-1">
                      {call?.email}
                    </span>
                  </div>
                  <div className="flex  items-center">
                    Phone:
                    <span className="text-xs text-success bg-success/20 border border-success/20 rounded-md px-1.5 py-0.5 ml-1">
                      {call?.phone}
                    </span>
                  </div>
                  <div className="flex  items-center">
                    Follow Up Date :
                    <span className="text-xs text-success bg-success/20 border border-success/20 rounded-md px-1.5 py-0.5 ml-1">
                      {call?.follow_up_date}
                    </span>
                  </div>
                </div>
              ) : (
                <button className="btn btn-success-soft" onClick={showMe}>
                  Show Me{" "}
                </button>
              )}
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <button
              type="button"
              onClick={() => {
                setValidationModal(false);
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>

            {show && (
              <button
                onClick={moveAdmin}
                type="button"
                className="btn btn-danger "
              >
                Transfer Customer To Admin
                {loading && (
                  <LoadingIcon
                    icon="three-dots"
                    color="white"
                    className="w-4 h-4 ml-2"
                  />
                )}
              </button>
            )}
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default AddCalls;
