import {
  Lucide,
  Modal,
  LoadingIcon,
  ModalBody,
  Litepicker,
  Alert,
} from "@/base-components";

import { useState } from "react";
import { useParams, Link } from "react-router-dom";

import { useRecoilStateLoadable, useRecoilValue } from "recoil";
import { callListState, allUserListState } from "../../state/admin-atom";

import { loginState } from "../../state/login-atom";

import Table from "./Table";

import axios from "axios";
import { adminApi } from "../../configuration";

import { filter } from "lodash";


//console.log("report", Date.parse("2022-12-21 10:31:12"));

function applySortFilters(array, searchValue, status, min, max, user_id) {
  return filter(array, (_items) => {
    return (
      _items.status &&
      _items.status.id === status &&
      _items.user_id === user_id &&
      Date.parse(_items.created_at) >= min &&
      Date.parse(_items.created_at) <= max
    );
  });
}

const AdminUsers = (props) => {
  // let { id } = useParams();
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);

  const [callData, setCallState] = useRecoilStateLoadable(callListState);
  const [usersData, setUserState] = useRecoilStateLoadable(allUserListState);
  const logindata = useRecoilValue(loginState);
  const [rowCount, setRowCount] = useState(10);

  const [search, setSearch] = useState("");
  const [aheck, setAcheck] = useState(false);
  const [call_id, setCallId] = useState(0);
  const [loading, setLoading] = useState(false);

  const [allCheck, setAllCheck] = useState([]);

  const [daterange, setDaterange] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState(0);
  const [user_id, selectUser] = useState(0);

  const [empName, setEmpName] = useState("");

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
      console.log(response);
      if (response?.data?.success) {
        setLoading(false);
        setCallState(response?.data?.data);
      }
    } catch (err) {
      setLoading(false);
    }
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

  let filterData = applySortFilters(
    callData.contents,
    search,
    parseInt(status),
    startDate,
    endDate,
    parseInt(user_id)
  );

  const handelRange = (date) => {
    setDaterange(date);

    var spilt = date.split("-");

    setStartDate(Date.parse(spilt[0]));

    setEndDate(Date.parse(spilt[1]));

    console.log("change date");
  };

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

  const handelStatus = (e) => {
    setStatus(e.target.value);
  };

  const handelUserSelect = (e) => {
    selectUser(e.target.value);

    setEmpName(e.target.selectedOptions[0].text);
  };

  return (
    <>
      <h2 className="intro-y text-lg font-medium mt-10 ">
        {" "}
        Generate{" "}
        {status == 1
          ? "Hot"
          : status == 2
          ? "Warm"
          : status == 3
          ? "Cold"
          : ""}{" "}
        Report{" "}
      </h2>
      <div className=" mt-5">
        <div className="intro-y flex flex-row mt-2">
          <div className="basis-2/4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Litepicker
              value={daterange}
              onChange={handelRange}
              options={{
                // format: "YYYY-MM-DD",
                autoApply: false,
                singleMode: false,
                numberOfColumns: 2,
                numberOfMonths: 2,
                showWeekNumbers: true,
                dropdowns: {
                  minYear: 1990,
                  maxYear: 2030,
                  months: true,
                  years: true,
                },
              }}
              className="form-control w-56 block mx-auto"
            />

            <select
              className="form-control"
              onChange={(e) => handelUserSelect(e)}
            >
              <option>Select Employee..</option>

              {usersData.state == "hasValue" &&
                usersData.contents.map((user, index) => {
                  return (
                    <option key={index} value={user.id}>
                      {user?.first_name + " " + user?.last_name} ({user?.email})
                    </option>
                  );
                })}
            </select>

            <select className="form-control" onClick={(e) => handelStatus(e)}>
              <option>Select Status..</option>
              <option value="1">Hot Report</option>
              <option value="2">Warm Report</option>

              <option value="3">Cold Report</option>
            </select>
          </div>

          <div className=" basis-2/4 flex flex-row-reverse pl-10">
            <select
              onChange={handelPageCount.bind(this)}
              className="w-20 form-select box mt-3 sm:mt-0 mx-5"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="35">35</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
        {/* BEGIN: Data List */}

        {filterData.length > 0 && (
          <div className="flex justify-center ">
            <Alert className="alert-dark mb-2 w-96 my-5">
              <div className="flex items-center">
                <div className="font-medium text-lg">
                  {status == 1
                    ? "Hot"
                    : status == 2
                    ? "Warm"
                    : status == 3
                    ? "Cold"
                    : ""}{" "}
                  Report ({daterange})
                </div>
              </div>
              <div className="mt-3 text-center">{empName}</div>
            </Alert>
          </div>
        )}

        <div className="intro-y col-span-12 overflow-auto relative">
          {callData.state === "hasValue" && filterData.length > 0 ? (
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
              <Table
                rowCount={rowCount}
                setDeleteConfirmationModal={setDeleteConfirmationModal}
                users={filterData}
                setUserId={setCallId}
                setCallState={setCallState}
                allCheck={allCheck}
                setAllCheck={setAllCheck}
                updateFunc={updateFunc}
                aheck={aheck}
                setAcheck={setAcheck}
              />
            </>
          ) : (
            <div className="flex justify-center ">
              <Alert className="alert-secondary mb-2 w-96 my-5">
                <div className="flex items-center">
                  <div className="font-medium text-lg">Generate New Report</div>
                </div>
                <div className="mt-3">
                  To Generate new report please select all of the options.
                </div>
              </Alert>
            </div>
          )}
        </div>
        {/* END: Data List */}
        {/* BEGIN: Pagination */}
        {filterData.length > 0 && (
          <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
            <button onClick={handelLoad} className="btn">
              Load more..
            </button>
          </div>
        )}
        {/* END: Pagination */}
      </div>
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
    </>
  );
};

export default AdminUsers;
