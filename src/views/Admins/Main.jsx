import { Lucide, Modal, LoadingIcon, ModalBody } from "@/base-components";

import { useState } from "react";

import { useRecoilStateLoadable } from "recoil";
import { allUserListState } from "../../state/admin-atom";

import UsersTable from "./UsersTable";

import axios from "axios";
import { adminApi } from "../../configuration";

import { filter } from "lodash";

function applySortFilters(array, searchValue) {
  return filter(array, (_items) => {
    return (
      _items.is_admin == 2 &&
      (_items.email.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
        _items.first_name.toLowerCase().indexOf(searchValue.toLowerCase()) !==
          -1)
    );
  });
}
import { authHeader } from "../../service/auth-header";

const AdminUsers = (props) => {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [newUserModal, setNewUserModal] = useState(false);
  const [usersData, setUserState] = useRecoilStateLoadable(allUserListState);
  const [rowCount, setRowCount] = useState(10);
  const [formdata, setFormdata] = useState([]);
  const [search, setSearch] = useState("");
  const [user_id, setUserId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState([]);
  const [headers, setToken] = useState(authHeader());
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

  let filterData = applySortFilters(usersData.contents, search);

  const createAdmin = async (e) => {
    e.preventDefault();

    var data = new FormData(e.target);

    data.append("is_admin", 2);

    const URL = adminApi() + "users";
    if (data.password !== formdata.cpassword) {
      alert("Password Not matching !");

      return false;
    }
    if (data.first_name == "") {
      alert("First Name Not matching !");
      return false;
    }

    if (data.last_name == "") {
      alert("Last Name Not matching !");
      return false;
    }

    if (data.email == "") {
      alert("E-mail required !");
      return false;
    }

    if (data.password == "") {
      alert("Password required !");
      return false;
    }

    setLoading(true);

    try {
      const response = await axios.post(URL, data, {
        headers,
      });

      if (response?.data?.success) {
        setUserState(response?.data?.data);

        setLoading(false);

        setNewUserModal(false);
        e.target.reset();
      } else {
        // alert("Something is wrong please try again later!");
        setErr(Object.values(response.data.data));
      }
    } catch (err) {
      setLoading(false);

      err?.response?.data?.data &&
        setErr(Object.values(err.response.data.data));
    }
  };

  const deleteAdmin = async () => {
    setLoading(true);
    const URL = adminApi() + "users/" + user_id;

    try {
      const response = await axios.delete(URL, {
        headers,
      });

      if (response?.data?.success) {
        setUserState(response?.data?.data);

        setDeleteConfirmationModal(false);
        setLoading(false);
      } else {
        alert("Something is wrong please try again later!");
      }
    } catch (err) {
      setLoading(false);
    }
  };
  return (
    <>
      <h2 className="intro-y text-lg font-medium mt-10 ">List Of Admins</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
          <button
            className="btn btn-primary shadow-md mr-2"
            onClick={() => setNewUserModal(true)}
          >
            Add New Admin
          </button>

          <div className="hidden md:block mx-auto text-slate-500">
            Showing {filterData.length} out of{" "}
            {usersData.state === "hasValue" && usersData.contents["length"]}
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

        <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
          {usersData.state === "hasValue" && (
            <UsersTable
              rowCount={rowCount}
              setDeleteConfirmationModal={setDeleteConfirmationModal}
              users={filterData}
              setUserId={setUserId}
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
        show={newUserModal}
        onHidden={() => {
          setNewUserModal(false);
        }}
      >
        <form onSubmit={(e) => createAdmin(e)}>
          <ModalBody className="p-0">
            <h3 className="text-3xl p-5 text-center">Create New Admins</h3>

            {err.length > 0 &&
              err.map((text, key) => {
                return (
                  <h3 className="text-danger py-3 text-center" key={key}>
                    {text}
                  </h3>
                );
              })}

            <div className="p-5">
              <div className="form-inline">
                <label
                  htmlFor="horizontal-form-1"
                  className="form-label sm:w-20"
                >
                  First name
                </label>
                <input
                  name="first_name"
                  type="text"
                  className="form-control"
                  placeholder="Jon"
                />
              </div>
              <div className="form-inline mt-5">
                <label
                  htmlFor="horizontal-form-1"
                  className="form-label sm:w-20"
                >
                  Last name
                </label>
                <input
                  name="last_name"
                  type="text"
                  className="form-control"
                  placeholder="Doe"
                />
              </div>
              <div className="form-inline mt-5">
                <label
                  htmlFor="horizontal-form-1"
                  className="form-label sm:w-20"
                >
                  Email
                </label>
                <input
                  name="email"
                  type="text"
                  className="form-control"
                  placeholder="example@gmail.com"
                />
              </div>
              <div className="form-inline mt-5">
                <label
                  htmlFor="horizontal-form-2"
                  className="form-label sm:w-20"
                >
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="secret"
                />
              </div>
              <div className="form-inline mt-5">
                <label
                  htmlFor="horizontal-form-2"
                  className="form-label sm:w-20"
                >
                  Confirm Password
                </label>
                <input
                  name="cpassword"
                  type="password"
                  className="form-control"
                  placeholder="secret"
                />
              </div>
            </div>

            <div className="px-5 pb-8 text-center">
              <button
                type="button"
                onClick={() => {
                  setNewUserModal(false);
                }}
                className="btn btn-outline-secondary w-24 mr-1"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary w-24">
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
          </ModalBody>
        </form>
      </Modal>
    </>
  );
};

export default AdminUsers;
