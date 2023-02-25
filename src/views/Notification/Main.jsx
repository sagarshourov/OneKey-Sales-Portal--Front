import { Lucide, Modal, LoadingIcon, ModalBody } from "@/base-components";

import { useState } from "react";

import { useRecoilStateLoadable } from "recoil";
import { notiState, callListState } from "../../state/admin-atom";

import UsersTable from "./UsersTable";

import axios from "axios";
import { adminApi } from "../../configuration";

import { filter } from "lodash";

function applySortFilters(array, searchValue) {
  return filter(array, (_items) => {
    return (
      _items?.user?.first_name
        .toLowerCase()
        .indexOf(searchValue.toLowerCase()) !== -1
    );
  });
}
const token = localStorage.getItem("token");

const headers = {
  Authorization: `Bearer ${token}`,
  ContentType: "application/json",
};

const NotificationMain = (props) => {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [callViewModal, setCallViewModal] = useState(false);
  const [notiData, setNotiState] = useRecoilStateLoadable(notiState);
  const [callData, setAllCallState] = useRecoilStateLoadable(callListState);

  const [rowCount, setRowCount] = useState(10);

  const [search, setSearch] = useState("");
  const [user_id, setUserId] = useState(0);
  const [loading, setLoading] = useState(false);

  const [call, setCall] = useState([]);


  console.log('call',call);



  const [noti_id, setNotiId] = useState([]);

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

  const updateRead = async (id, type, call_id) => {
    const LOGIN_URL = adminApi() + "notifications/" + id;

    try {
      const response = await axios.put(
        LOGIN_URL,
        { is_read: 1, call_id: call_id, type: type },
        {
          headers,
        }
      );
      setLoading(false);

      setNotiState(response?.data?.data?.noti);

      setCall(response?.data?.data?.call);

      //window.location.reload();
    } catch (err) {
      console.log("err", err);
      setLoading(false);
    }
  };

  const handelView = (e) => {
    if (e.type === 1) {
      updateRead(e.id, e.type, e.call_id);
      setCallViewModal(true);
    }
  };

  let filterData = applySortFilters(notiData.contents, search);

  const deleteNoti = async () => {
    setLoading(true);
    const URL = adminApi() + "notifications/" + noti_id;

    try {
      const response = await axios.delete(URL, {
        headers,
      });

      if (response?.data?.success) {
        setDeleteConfirmationModal(false);
        setLoading(false);
        setNotiState(response?.data?.data);
      } else {
        alert("Something is wrong please try again later!");
      }
    } catch (err) {
      setLoading(false);
    }
  };
  const approveUser = async (id) => {
    console.log("approve", user_id);

    const LOGIN_URL = adminApi() + "calls/" + id;

    try {
      const response = await axios.put(
        LOGIN_URL,
        { name: "deleted_at", value: null, user_id: user_id, type: 3 },
        {
          headers,
        }
      );
      setLoading(false);
      setAllCallState(response?.data?.data);
      setCallViewModal(false);
      //window.location.reload();
    } catch (err) {
      console.log("err", err);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-5">
          <h2 className="intro-y text-lg font-medium mt-0 ">
            Notifications List
          </h2>
          <div className="hidden md:block mx-auto text-slate-500">
            Showing {filterData.length} out of{" "}
            {notiData.state === "hasValue" && notiData.contents["length"]}
          </div>
          <select
            onChange={handelPageCount.bind(this)}
            className="w-20 form-select box mt-3 sm:mt-0"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="35">35</option>
            <option value="50">50</option>
          </select>

          <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
            <div className="w-56 relative text-slate-500">
              <input
                onChange={handelSearch.bind(this)}
                type="text"
                className="form-control w-56 box pr-10"
                placeholder="Search..."
              />
              <Lucide
                icon="Search"
                className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
              />
            </div>
          </div>
        </div>
        {/* BEGIN: Data List */}

        <div className="intro-y col-span-12  overflow-auto ">
          {notiData.state === "hasValue" && (
            <UsersTable
              rowCount={rowCount}
              setDeleteConfirmationModal={setDeleteConfirmationModal}
              users={filterData}
              setUserId={setUserId}
              handelView={handelView}
              setNotiId={setNotiId}
            />
          )}
        </div>
        {/* END: Data List */}
        {/* BEGIN: Pagination */}
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
          <button onClick={handelLoad} className="btn">
            Load more..
          </button>
        </div>
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
              onClick={deleteNoti}
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
        show={callViewModal}
        onHidden={() => {
          setCallViewModal(false);
        }}
      >
        <ModalBody className="p-0">
          <h3 className="text-xl pt-5 text-center">User Details</h3>
          <div className="my-5 ">
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
                Assigned To :
                <span className="text-xs text-success bg-success/20 border border-success/20 rounded-md px-1.5 py-0.5 ml-1">
                  {call?.user?.first_name}  {call?.user?.last_name}
                </span>
              </div>
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <button
              type="button"
              onClick={() => {
                setCallViewModal(false);
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>

            <button
              onClick={() => approveUser(call.id)}
              type="button"
              className="btn btn-success text-white"
            >
              Approve
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
    </>
  );
};

export default NotificationMain;
