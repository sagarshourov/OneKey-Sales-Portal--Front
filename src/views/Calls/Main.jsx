import {
  Lucide,
  Modal,
  LoadingIcon,
  ModalBody,
  AccordionPanel,
  Accordion,
  AccordionGroup,
  AccordionItem,
} from "@/base-components";
import dom from "@left4code/tw-starter/dist/js/dom";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { useRecoilStateLoadable, useRecoilValue } from "recoil";
import { callListState } from "../../state/admin-atom";

import { loginState } from "../../state/login-atom";

import Table from "./Table";

import axios from "axios";
import { adminApi, getBaseApi } from "../../configuration";

import { filter } from "lodash";
import { helper } from "@/utils/helper";
import FollowUp from "./FollowUp";
import CallSchedule from "./CallSchedule";
import classnames from "classnames";
import { settingState } from "../../state/setting-atom";

function todayFilters(array) {
  // var today = "";
  if (array.length == 0) return;
  var today = new Date();

  var today = helper.formatDate(today, "YYYY-MM-DD");

  return filter(array, (_items) => {
    return Date.parse(_items.follow_up_date) === Date.parse(today);
  });
}

function towFilters(array) {
  var tomorrow = new Date();

  tomorrow =
    tomorrow.getFullYear() +
    "-" +
    (tomorrow.getMonth() + 1) +
    "-" +
    (tomorrow.getDate() + 1);

  tomorrow = helper.formatDate(tomorrow, "YYYY-MM-DD");

  return filter(array, (_items) => {
    return Date.parse(_items.follow_up_date) === Date.parse(tomorrow);
  });
}

function get_single(arr) {
  var date = "";
  if (arr.extra.length > 0) {
    arr.extra.map((dat, index) => {
      if (dat.groups == "my_step" && dat.values[0].value) {
        date = dat.values[0].value;
      }
    });
  }

  //console.log(date);

  return Date.parse(date);
}

function nextFilters(array) {
  var tomorrow = new Date();

  tomorrow =
    tomorrow.getFullYear() +
    "-" +
    (tomorrow.getMonth() + 1) +
    "-" +
    (tomorrow.getDate() + 1);

  tomorrow = helper.formatDate(tomorrow, "YYYY-MM-DD");

  return filter(array, (_items) => {
    return get_single(_items) === Date.parse(tomorrow);
  });
}

function scheduleFilters(array) {
  if (array.length == 0) return;
  var today = new Date();

  var today = helper.formatDate(today, "YYYY-MM-DD");

  return filter(array, (_items) => {
    return Date.parse(_items.call_schedule_date) === Date.parse(today);
  });
}

function applySortFilters(array, searchValue, sec, user_id) {
  if (array.length == 0) return;
  // if (sec == "no") {
  //   return filter(array, (_items) => {
  //     return (
  //       _items.user_id == user_id || _items.email.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
  //     );
  //   });
  // } else

  if (user_id !== 0) {
    if (sec == "all") {
      return filter(array, (_items) => {
        return (
          _items.sections == null &&
          _items.user_id === user_id &&
          _items.results &&
          _items.results.id == 3 &&
          ((_items.email &&
            _items.email.toLowerCase().indexOf(searchValue.toLowerCase()) !==
              -1) ||
            (_items.first_name &&
              _items.first_name
                .toLowerCase()
                .indexOf(searchValue.toLowerCase()) !== -1) ||
            (_items.phone_number &&
              _items.phone_number
                .toLowerCase()
                .indexOf(searchValue.toLowerCase()) !== -1))
        );
      });
    } else {
      return filter(array, (_items) => {
        // if (_items.email) {
        return (
          _items.sections == parseInt(sec) &&
          _items.user_id === user_id &&
          _items.results.id == 3 &&
          ((_items.email &&
            _items.email.toLowerCase().indexOf(searchValue.toLowerCase()) !==
              -1) ||
            (_items.first_name &&
              _items.first_name
                .toLowerCase()
                .indexOf(searchValue.toLowerCase()) !== -1) ||
            (_items.phone_number &&
              _items.phone_number
                .toLowerCase()
                .indexOf(searchValue.toLowerCase()) !== -1))
        );
        // } else {
        //   return true;
        // }
      });
    }
  } else {
    
    if (sec == "all") {
      return filter(array, (_items) => {
        return (
          _items.sections == null &&
          _items.results &&
          _items.results.id == 3 &&
          ((_items.email &&
            _items.email.toLowerCase().indexOf(searchValue.toLowerCase()) !==
              -1) ||
            (_items.first_name &&
              _items.first_name
                .toLowerCase()
                .indexOf(searchValue.toLowerCase()) !== -1) ||
            (_items.phone_number &&
              _items.phone_number
                .toLowerCase()
                .indexOf(searchValue.toLowerCase()) !== -1))
        );
      });
    } else {
      return filter(array, (_items) => {
        // if (_items.email) {
        return (
          _items.sections == parseInt(sec) &&
          _items.results.id == 3 &&
          ((_items.email &&
            _items.email.toLowerCase().indexOf(searchValue.toLowerCase()) !==
              -1) ||
            (_items.first_name &&
              _items.first_name
                .toLowerCase()
                .indexOf(searchValue.toLowerCase()) !== -1) ||
            (_items.phone_number &&
              _items.phone_number
                .toLowerCase()
                .indexOf(searchValue.toLowerCase()) !== -1))
        );
        // } else {
        //   return true;
        // }
      });
    }
  }
}

function findByValue(array, field) {
  return filter(array, (_items) => {
    return _items.field == field;
  });
}

const AdminUsers = (props) => {
  let { id } = useParams();
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);

  const [callData, setCallState] = useRecoilStateLoadable(callListState);
  const [rowCount, setRowCount] = useState(10);
  const [search, setSearch] = useState("");
  const [aheck, setAcheck] = useState(false);
  const [call_id, setCallId] = useState(0);
  const [loading, setLoading] = useState(false);

  const [historyModal, setHistoryModal] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyTitle, setHistoryTitle] = useState("");

  const [allCheck, setAllCheck] = useState([]);

  const logindata = useRecoilValue(loginState);

  const [histoyText, setHistoryText] = useState("");
  const [row, setRow] = useState([]);
  const [rowId, setRowID] = useState(0);
  const [callSwitch, setCallSwitch] = useState(false);

  const setting = useRecoilValue(settingState);

  console.log("logindata", logindata.role);

  const backToTop = () => {
    console.log("loginData");
    window.scroll({ top: 0, behavior: "smooth" });
  };

  const exportExcel = () => {
    // console.log("Export Excel");

    window.open(getBaseApi() + "call/export", "_blank");
  };

  const handelGo = (section) => {
    document.getElementsByClassName(
      "item" + section
    )[0].parentNode.style.display = "block";
  };

  const dragStart = (e, id) => {
    setRow(e.target);
    setRowID(id);
  };
  const dragover = (e) => {
    e.preventDefault();
    let children = Array.from(e.target.parentNode.parentNode.children);
    // console.log("children", children);
    // console.log("row", row);

    // console.log("parent", e.target.parentNode);

    if (children.indexOf(e.target.parentNode) > children.indexOf(row)) {
      e.target.parentNode.after(row);
    } else {
      e.target.parentNode.before(row);
    }
  };

  const headers = {
    Authorization: `Bearer ${logindata?.token}`,
    ContentType: "application/json",
  };

  const updateFunc = async (id, name, value) => {
    const URL = adminApi() + "calls/" + id;
    setLoading(true);

    try {
      const response = await axios.put(
        URL,
        { name: name, value: value },
        {
          headers,
        }
      );

      if (response?.data?.success) {
        setLoading(false);
        setCallState(response?.data?.data);
      }
    } catch (err) {
      setLoading(false);
    }
  };
  const tableDragOver = (e, section) => {
    e.preventDefault();

    updateFunc(rowId, "sections", section);
  };

  const AllTableDrop = (e) => {
    e.preventDefault();
    updateFunc(rowId, "sections", null);
  };

  const allowDrop = (ev) => {
    ev.preventDefault();
  };

  const handelPageCount = (e) => {
    setRowCount(parseInt(e.target.value));
  };

  const handelLoad = () => {
    let count = rowCount + 20;

    setRowCount(count);
  };

  const handelSearch = (e) => {
    setSearch(e.target.value);
  };

  //let filterData = applySortFilters(callData.contents, search, id, 0);

  const deleteAdmin = async () => {
    setLoading(true);
    const URL = adminApi() + "calls/" + call_id;

    try {
      const response = await axios.delete(URL, {
        headers,
        data: allCheck,
      });

      if (response?.data?.success) {
        setCallState(response?.data?.data);

        setDeleteConfirmationModal(false);
        setLoading(false);
      } else {
        alert("Something is wrong please try again later!");
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const bulkUpdate = async (name, value) => {
    const URL = adminApi() + "calls/0";
    setLoading(true);

    try {
      const response = await axios.put(
        URL,
        { ids: allCheck, name: name, value: value },
        {
          headers,
        }
      );

      if (response?.data?.success) {
        setLoading(false);
        setCallState(response?.data?.data);
        setAllCheck([]);
        setAcheck(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const setHistory = async (field, data, id) => {
    setCallId(id);
    var dataz = findByValue(data, field);
    setHistoryTitle(field);
    setHistoryData(dataz);
    //console.log('his',data);
    setHistoryModal(true);
  };

  const saveHistory = async () => {
    //console.log('historyData',historyData);

    if (histoyText == "") {
      alert("Text Required!");
    }
    setLoading(true);
    const URL = adminApi() + "call_single/" + call_id;
    try {
      const response = await axios.put(
        URL,
        {
          name: historyTitle,
          value: histoyText,
          type: 2,
          user_id: logindata.userId,
        },
        {
          headers,
        }
      );

      if (response?.data?.success) {
        setCallState(response?.data?.data);
        setHistoryModal(false);
        setLoading(false);
        histoyText("");
      } else {
        alert("Something is wrong please try again later!");
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const [offset, setOffset] = useState(false);

  useEffect(() => {
    //const chatMessages = document.getElementById("whatsAppChat");

    var warper = dom(".wrapper")[0];

    const onScroll = () => setOffset(window.pageYOffset);
    // // clean up code
    // window.removeEventListener("scroll", onScroll);
    warper.addEventListener(
      "scroll",
      function () {
        if (warper.scrollTop > 150) {
          setOffset(true);
        } else {
          setOffset(false);
        }
      },
      { passive: true }
    );
    return () => warper.removeEventListener("scroll", onScroll);
  }, []);

  const CallSwitch = () => {
    setCallSwitch(() => !callSwitch);
  };

  //console.log("offset", offset);

  return (
    <div className="">
      <h2 className="intro-y text-lg font-medium mt-10 ">Call List</h2>
      <div className={offset ? "fixed top-0 bg-white p-5 z-50 box " : ""}>
        <div className="intro-y   col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
          <div className="bg-info bg-danger bg-success bg-warning bg-yellow-400 bg-secondary bg-purple-600 z-10 z-50"></div>
          <div className="  lg:basis-9/12 grid grid-cols-4 lg:grid-cols-6 gap-2 ">
            <Link
              className="btn btn-elevated-primary shadow-md mr-2 py-2"
              to="/calls/add"
            >
              Add New Call
            </Link>

            {allCheck.length == 1 && (
              <Link
                className="btn btn-elevated-pending shadow-md mr-2 py-2"
                to={"/calls/edit/" + allCheck[0]}
              >
                Edit
              </Link>
            )}

            {allCheck.length > 0 ? (
              <>
                <button
                  onClick={() => setDeleteConfirmationModal(true)}
                  className="btn btn-elevated-danger"
                >
                  Delete
                </button>

                {logindata.role !== 3 && (
                  <select
                    name="results"
                    onChange={(e) => bulkUpdate(e.target.name, e.target.value)}
                    className="form-select"
                  >
                    <option value="0">Results..</option>

                    {setting.results &&
                      setting.results.map((val, indx) => (
                        <option key={indx} value={val?.id}>
                          {val?.title}
                        </option>
                      ))}

                    {/* 
                    <option value="3">Open</option>
                    <option value="4">No Answer</option>
                    <option value="1">Cancel </option>
                    <option value="2">Client</option> */}
                  </select>
                )}
                <select
                  name="sections"
                  onChange={(e) => bulkUpdate(e.target.name, e.target.value)}
                  className="form-select"
                >
                  <option value="0">Move..</option>

                  {setting.sections &&
                    setting.sections.map((val, indx) => (
                      <option key={indx} value={val?.id}>
                        {val?.title}
                      </option>
                    ))}
                </select>
              </>
            ) : (
              //parseInt(logindata.role) !== 3 && (
              <>
                <Link
                  className="btn btn-elevated-success text-white shadow-md mr-2 py-2"
                  to="/calls/import"
                >
                  Import Excel
                </Link>

                <button
                  onClick={exportExcel}
                  className="btn btn-elevated-warning text-white shadow-md mr-2 py-2"
                >
                  Export Excel
                </button>
              </>
              //)
            )}

            {logindata.role !== 3 && (
              <div className="relative">
                <div
                  onClick={CallSwitch}
                  className="dark-mode-switcher cursor-pointer shadow-md absolute bottom-0 left-0 box border rounded-full w-36 h-10 flex items-center justify-center z-50 "
                >
                  <div className="mr-4 text-slate-600 dark:text-slate-200">
                    Won Calls
                  </div>
                  <div
                    className={classnames({
                      "dark-mode-switcher__toggle border": true,
                      "dark-mode-switcher__toggle--active": callSwitch,
                    })}
                  ></div>
                </div>
              </div>
            )}
          </div>
          {/* <div className="hidden md:block mx-auto text-slate-500">
               {filterData.length} {" /"}
              {callData.state === "hasValue" && callData.contents["length"]}
            </div> */}

          <div className="lg:basis-2/12   grid  grid-cols-2">
            <select
              onChange={handelPageCount.bind(this)}
              className="w-full lg:w-20 form-select box mt-3 sm:mt-0"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="35">35</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>

            <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
              <div className="relative md:w-36 lg:w-52 text-slate-500">
                <input
                  onChange={handelSearch.bind(this)}
                  type="text"
                  className="form-control md:w-36 lg:w-52 box"
                  placeholder="Search..."
                />
                <Lucide
                  icon="Search"
                  className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4  gap-4 mt-5">
        <div className="col-span-1 lg:order-1 order-2 lg:col-span-3 z-10">
          {/* BEGIN: Data List */}

          <div className="intro-y mt-5 col-span-12 ">
            {callData.state === "hasValue" && (
              <>
                {loading && (
                  <div className="h-full w-full bg-gray-50/75 grid  absolute z-[100]">
                    <div className="w-24 h-24 place-self-center">
                      <LoadingIcon
                        icon="three-dots"
                        color="gray"
                        className="w-4 h-4 ml-2"
                      />
                    </div>
                  </div>
                )}
                <div
                  onDrop={(e) => AllTableDrop(e)}
                  onDragOver={(e) => allowDrop(e)}
                >
                  <AccordionGroup className="accordion-boxed ">
                    <AccordionItem className="box">
                      <Accordion>Non Section</Accordion>
                      <AccordionPanel className="text-slate-600 dark:text-slate-500 leading-relaxed">
                        <Table
                          rowCount={rowCount}
                          setDeleteConfirmationModal={
                            setDeleteConfirmationModal
                          }
                          users={applySortFilters(
                            callData.contents,
                            search,
                            "all",
                            callSwitch ? logindata.userId : 0
                          )}
                          setUserId={setCallId}
                          setCallState={setCallState}
                          allCheck={allCheck}
                          setAllCheck={setAllCheck}
                          updateFunc={updateFunc}
                          aheck={aheck}
                          setAcheck={setAcheck}
                          setHistory={setHistory}
                          theme="bg-lite text-black"
                          dragStart={dragStart}
                          dragover={dragover}
                          tableDragOver={tableDragOver}
                          section={0}
                          setting={setting}
                        />
                      </AccordionPanel>
                    </AccordionItem>
                  </AccordionGroup>
                </div>

                {callData.state === "hasValue" &&
                  setting.sections &&
                  setting.sections.map((val, indx) => {
                    let calls = applySortFilters(
                      callData.contents,
                      search,
                      val?.id,
                      callSwitch ? logindata.userId : 0
                    );
                    // if (calls.length == 0) return;

                    return (
                      <div
                        key={indx}
                        onDrop={(e) => tableDragOver(e, val?.id)}
                        onDragOver={(e) => allowDrop(e)}
                      >
                        <AccordionGroup
                          draggable={true}
                          className="accordion-boxed mt-5"
                          selectedIndex={null}
                        >
                          <AccordionItem className={"box "}>
                            <Accordion>{val?.title}</Accordion>
                            <AccordionPanel
                              id={"item" + val?.id}
                              className={
                                "text-slate-600 dark:text-slate-500 leading-relaxed item" +
                                val?.id
                              }
                            >
                              <Table
                                rowCount={rowCount}
                                setDeleteConfirmationModal={
                                  setDeleteConfirmationModal
                                }
                                users={calls}
                                setUserId={setCallId}
                                setCallState={setCallState}
                                allCheck={allCheck}
                                setAllCheck={setAllCheck}
                                updateFunc={updateFunc}
                                aheck={aheck}
                                setAcheck={setAcheck}
                                setHistory={setHistory}
                                theme={val?.theme}
                                dragStart={dragStart}
                                dragover={dragover}
                                tableDragOver={tableDragOver}
                                section={val?.id}
                                setting={setting}
                              />
                            </AccordionPanel>
                          </AccordionItem>
                        </AccordionGroup>
                      </div>
                    );
                  })}
              </>
            )}
          </div>

          {/* END: Data List */}
          {/* BEGIN: Pagination */}

          {/* {callData.state === "hasValue" && (
            <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
              <button onClick={handelLoad} className="btn">
                Load more..
              </button>
            </div>
          )} */}

          {/* END: Pagination */}
        </div>

        <div className="col-span-1 lg:order-2 order-1 pt-12">
          {callData.state === "hasValue" && (
            <>
              <CallSchedule
                title="Today's Call Schedule"
                theme=" bg-warning text-white"
                handelGo={handelGo}
                data={scheduleFilters(callData.contents)}
              />
              <FollowUp
                title="Today’s Follow Ups"
                theme="table-dark"
                handelGo={handelGo}
                data={todayFilters(callData.contents)}
              />

              <FollowUp
                title="Tomorrow’s Follow Ups"
                theme="table-light"
                handelGo={handelGo}
                data={towFilters(callData.contents)}
              />
              <FollowUp
                title="Next Step"
                theme=" bg-success text-white"
                handelGo={handelGo}
                data={nextFilters(callData.contents)}
              />
            </>
          )}
        </div>
      </div>
      {/* Grid */}
      {/* BEGIN: Delete Confirmation Modal */}
      <Modal
        show={deleteConfirmationModal}
        onHidden={() => {
          setDeleteConfirmationModal(false);
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 text-danger mx-auto mt-3"
            />
            <div className="text-3xl mt-5">Are you sure?</div>
            <div className="text-slate-500 mt-2">
              Do you really want to delete these records? <br />
              This process cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <button
              type="button"
              onClick={() => {
                setDeleteConfirmationModal(false);
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>
            <button
              onClick={deleteAdmin}
              type="button"
              className="btn btn-danger w-24"
            >
              Delete
              {loading && (
                <LoadingIcon
                  icon="three-dots"
                  color="white"
                  className="w-4 h-4 ml-2"
                />
              )}
            </button>
          </div>
        </ModalBody>
      </Modal>
      {/* END: Delete Confirmation Modal */}

      <Modal
        size="modal-lg"
        show={historyModal}
        onHidden={() => {
          setHistoryModal(false);
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <div className="text-xl capitalize mb-5">
              {historyTitle.replaceAll("_", " ")}
            </div>
            <div className="col-12">
              <textarea
                defaultValue={histoyText}
                className="form-control"
                onChange={(e) => setHistoryText(e.target.value)}
              ></textarea>
            </div>
            <div className="px-5 pb-8 mt-5 text-center">
              <button
                type="button"
                onClick={() => {
                  setHistoryModal(false);
                }}
                className="btn btn-outline-secondary w-24 mr-1"
              >
                Close
              </button>
              <button
                onClick={saveHistory}
                type="button"
                className="btn btn-success text-white w-24"
              >
                Save
                {loading && (
                  <LoadingIcon
                    icon="three-dots"
                    color="white"
                    className="w-4 h-4 ml-2"
                  />
                )}
              </button>
            </div>

            <AccordionGroup className="accordion-boxed ">
              {historyData.map((value, index) => {
                if (value?.value == null) return;

                return (
                  <AccordionItem key={index}>
                    <Accordion>
                      {helper.formatDate(
                        value?.updated_at,
                        "MMM D, YYYY h:mm A"
                      )}
                    </Accordion>
                    <AccordionPanel className="text-slate-600 dark:text-slate-500 leading-relaxed">
                      {value?.value}
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
            </AccordionGroup>
          </div>
        </ModalBody>
      </Modal>

      {/* <button className="backToTop-btn k-button " onClick={() => backToTop()}>
        <div className="d-none d-xl-block mr-1">Top</div>
      </button> */}
    </div>
  );
};

export default AdminUsers;
