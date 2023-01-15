import {
  Lucide,
  Tippy,
  LoadingIcon,
  Modal,
  ModalBody,
  Checkbox,
} from "@/base-components";

import { filter } from "lodash";
import { any } from "prop-types";
import { useState } from "react";
// function findById(array, id) {
//   return filter(array, (_items) => {
//     return _items.id === id;
//   });
// }

import { adminApi } from "../../configuration";

import axios from "axios";
const Table = (props) => {
  const { value, headers, setAllTable, tbl } = props;

  const [rowCount, setRowCount] = useState(10);
  const [delModal, setDelModal] = useState(false);

  const [cModal, setCModal] = useState(false);
  const [uModal, setUModal] = useState(false);

  const [row, setRow] = useState([]);

  const [loading, setLoading] = useState(false);

  const handelSearch = (e) => {
    setSearch(e.target.value);
  };

  const handelPageCount = (e) => {
    setRowCount(parseInt(e.target.value));
  };

  const handelEdit = (row) => {
    console.log("edit");
    setRow(row);
    setUModal(true);
  };

  const delRow = async () => {
    console.log(row.id);
    setLoading(true);
    const URL = adminApi() + "settings/" + tbl + "/" + row.id;

    try {
      const response = await axios.get(URL, {
        headers,
      });
      if (response?.data?.success) {
        setLoading(false);
        setAllTable(response?.data?.data);
        setDelModal(false);
        setRow([]);
      } else {
        alert("Something is wrong please try again later!");
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const cuSave = async (e) => {
    e.preventDefault();

    console.log("save", tbl);

    var data = new FormData(e.target);

    console.log("data", data);
    data.append("table", tbl);
    const URL = adminApi() + "settings";

    setLoading(true);

    try {
      const response = await axios.post(URL, data, {
        headers,
      });
      console.log(response);
      if (response?.data?.success) {
        setLoading(false);

        setAllTable(response?.data?.data);
        setUModal(false);
        setCModal(false);
        setRow([]);
      }
    } catch (err) {
      setLoading(false);
    }

    e.target.reset();
  };

  return (
    <>
      <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2 mb-5">
        <button
          className="btn btn-primary shadow-md mr-2"
          onClick={(e) => setCModal(true)}
        >
          Add New
        </button>

        <div className="hidden md:block mx-auto text-slate-500">
          Showing {value.length} out of {value.length}
        </div>
        {/* <select
          onChange={handelPageCount.bind(this)}
          className="w-20 form-select box mt-3 sm:mt-0"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="35">35</option>
          <option value="50">50</option>
        </select> */}

        {/* <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
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
        </div> */}
      </div>
      <table className="table table-hover ">
        <thead className="table-light">
          <tr>
            {value.length > 0 &&
              Object.keys(value[0]).map((val, index) => {
                return (
                  <th key={index} className="whitespace-nowrap capitalize">
                    {val.replace(/_/g, " ")}
                  </th>
                );
              })}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {value.length > 0 &&
            Object.values(value).map((val, ind) => {
              return (
                <tr key={ind}>
                  {Object.values(val).map((valu, inde) => (
                    <td key={inde}>{valu}</td>
                  ))}
                  <td className="table-report__action w-56">
                    <div className="flex justify-center items-center">
                      <button
                        className="flex items-center text-info mr-3"
                        onClick={(e) => handelEdit(val)}
                      >
                        <Lucide icon="Info" className="w-4 h-4 mr-1 " /> Edit
                      </button>

                      <button
                        onClick={(e) => {
                          setRow(val);
                          setDelModal(true);
                        }}
                        className="flex items-center text-danger"
                      >
                        <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      <Modal
        show={uModal}
        onHidden={() => {
          setUModal(false);
        }}
      >
        <ModalBody className="p-0">
          <form onSubmit={(e) => cuSave(e)}>
            <div className="p-5 text-center">
              <div className="text-3xl mt-5">Edit Modal</div>
              <div className=" mt-2">
                {value.length > 0 &&
                  Object.keys(value[0]).map((val, index) => {
                    if (val == "id") {
                      return (
                        <input
                          key={index}
                          type="hidden"
                          name={val}
                          defaultValue={row[val]}
                        />
                      );
                    }

                    return (
                      <div key={index} className="form-inline">
                        <label className="capitalize form-label sm:w-20">
                          {val.replace(/_/g, " ")}
                        </label>
                        <input
                          className="form-control mt-2"
                          type="text"
                          name={val}
                          defaultValue={row[val]}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="px-5 pb-8 text-center">
              <button
                type="button"
                onClick={() => {
                  setUModal(false);
                }}
                className="btn btn-outline-secondary w-24 mr-1"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success text-white w-24">
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
          </form>
        </ModalBody>
      </Modal>

      <Modal
        show={cModal}
        onHidden={() => {
          setCModal(false);
        }}
      >
        <ModalBody className="p-0">
          <form onSubmit={(e) => cuSave(e)}>
            <div className="p-5 text-center">
              <div className="text-3xl mt-5">Add Modal</div>
              <div className=" mt-2">
                {value.length > 0 &&
                  Object.keys(value[0]).map((val, index) => {
                    if (val == "id") {
                      return false;
                    }

                    return (
                      <div key={index} className="form-inline">
                        <label className="capitalize form-label sm:w-20">
                          {val.replace(/_/g, " ")}
                        </label>
                        <input
                          className="form-control mt-2"
                          type="text"
                          name={val}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="px-5 pb-8 text-center">
              <button
                type="button"
                onClick={() => {
                  setCModal(false);
                }}
                className="btn btn-outline-secondary w-24 mr-1"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success text-white w-24">
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
          </form>
        </ModalBody>
      </Modal>

      <Modal
        show={delModal}
        onHidden={() => {
          setDelModal(false);
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
                setDelModal(false);
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>
            <button
              onClick={delRow}
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
    </>
  );
};

export default Table;
