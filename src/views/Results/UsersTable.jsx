import { Lucide, Tippy, LoadingIcon, Checkbox } from "@/base-components";

import { filter } from "lodash";
import { useState } from "react";
// function findById(array, id) {
//   return filter(array, (_items) => {
//     return _items.id === id;
//   });
// }

import { Link } from "react-router-dom";

const formatDate = (dat) => {

  return dat;
  //const date = dat.split(" ");
//  return dat.split("T")[0];
};

const UsersTable = (props) => {
  const { users, rowCount, allCheck, setAllCheck } = props;

  const handelChange = (e, id) => {
    e.preventDefault();
  };
  const handelSingleCheck = (e) => {
    const { id, checked } = e.target;

    setAllCheck([...allCheck, parseInt(id)]);
    if (!checked) {
      setAllCheck(allCheck.filter((item) => item !== parseInt(id)));
    }
  };
  const handelAllCheck = (e) => {
    const { checked } = e.target;

    if (checked) {
      setAllCheck(users.map((li) => li.id));
      // setAcheck(true);
    } else {
      setAllCheck([]);
      // setAcheck(false);
    }
  };
  return (
    <>
      <table className="table table-report -mt-2">
        <thead>
          <tr>
            <th className="whitespace-nowrap">
              <div className=" mt-2">
                <Checkbox
                  className="form-check-input"
                  key={0}
                  type="checkbox"
                  name="allcheck"
                  id={0}
                  handleClick={handelAllCheck}
                  // isChecked={allCheck.length > 0 ? true : false}
                />
              </div>
            </th>
            <th className="whitespace-nowrap">No</th>
            <th className="whitespace-nowrap">Client</th>
            <th className="text-center whitespace-nowrap">Priority</th>

            <th className="text-center whitespace-nowrap">
              First Contact Date
            </th>
            <th className="text-center whitespace-nowrap">Note</th>
            <th className="text-center whitespace-nowrap">
              Follow up date set
            </th>
            <th className="text-center whitespace-nowrap">Status</th>
            <th className="text-center whitespace-nowrap">AG</th>
            <th className="text-center whitespace-nowrap">Package</th>
            <th className="text-center whitespace-nowrap">Last Contact Date</th>
            <th className="text-center whitespace-nowrap">Age</th>
            <th className="text-center whitespace-nowrap">GPA</th>
            <th className="text-center whitespace-nowrap">
              {" "}
              Last Status Date{" "}
            </th>
            <th className="text-center whitespace-nowrap">
              {" "}
              First Call Notes
            </th>
            <th className="text-center whitespace-nowrap"> Results</th>
            <th className="text-center whitespace-nowrap">
              {" "}
              Cancelation Reason
            </th>
            <th className="text-center whitespace-nowrap"> Feedback</th>
          </tr>
        </thead>
        <tbody>
          {users.slice(0, rowCount).map((user, key) => {
            let count = key + 1;
            return (
              <tr key={key} className="intro-x border-t">
                <td>
                  <div className="form-check mt-2">
                    <Checkbox
                      className="form-check-input "
                      key={key}
                      type="checkbox"
                      name="select"
                      id={user.id}
                      handleClick={handelSingleCheck}
                      isChecked={allCheck.includes(user.id)}
                    />
                  </div>
                </td>
                <td className="w-40">{count}</td>
                <td>
                  <Link to="#" className="font-medium whitespace-nowrap">
                    {user.first_name} {user.last_name}
                  </Link>
                  <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                    {user.email}
                  </div>
                </td>
                <td className="text-center">{user?.priority?.title}</td>

                <td className="text-center">{formatDate(user.created_at)}</td>
                <td className="text-center">
                  <div className="text-center">
                    <Tippy tag="a" href="#" className="tooltip" content="">
                      11.23 Mojarrad,..
                    </Tippy>
                  </div>
                </td>
                <td className="text-center">{formatDate(user.created_at)}</td>
                <td>{user?.status?.title}</td>
                <td>
                  <div className="form-check mt-2">
                    <input
                      name="ag"
                      className="form-check-input"
                      type="checkbox"
                      id={user.id}
                      defaultChecked={user.ag == 1 ? true : false}
                      disabled
                    />
                  </div>
                </td>
                <td>{user?.package?.title}</td>
                <td className="text-center">{formatDate(user.created_at)}</td>
                <td className="text-center">37-S</td>
                <td className="text-center">k-18</td>
                <td className="text-center">{formatDate(user.created_at)}</td>

                <td className="text-center">
                  <div className="text-center">
                    <Tippy tag="a" href="#" className="tooltip" content="">
                      11.23 Mojarrad,..
                    </Tippy>
                  </div>
                </td>
                <td>{user?.results?.title}</td>

                {/* <td>
                  <select
                    onChange={(e) => handelChange(e, user.id)}
                    name="results"
                    className="form-select form-select-sm mt-2 w-20"
                    defaultValue={user.results.id}
                  >
                    <option value="0">Select..</option>
                    <option value="1">Cancel</option>
                    <option value="2">Client</option>
                    <option value="3">Open</option>
                  </select>
                </td> */}

                <td>{user?.cancel_reason?.title}</td>
                <td className="text-center">
                  <div className="text-center">
                    <Tippy tag="a" href="#" className="tooltip" content="">
                      11.23 Mojarrad,..
                    </Tippy>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default UsersTable;
