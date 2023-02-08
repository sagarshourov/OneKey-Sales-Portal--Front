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
  //const date = dat.split(" ");
  return dat.split("T")[0];
};

const fText = (text) => {
  return text ? text.substr(0, 10) + "..." : "";
};

const UsersTable = (props) => {
  const {
    users,
    rowCount,
    setUserId,
    setDeleteConfirmationModal,
    allCheck,
    setAllCheck,
    updateFunc,
    aheck,
    setAcheck,
  } = props;

  const handelChange = (e, id, type) => {
    e.preventDefault();

    var val = 0;
    if (type == "n") {
      val = parseInt(e.target.value);
    }
    updateFunc(id, e.target.name, val);
  };

  const handelAllCheck = (e) => {
    const { checked } = e.target;

    if (checked) {
      setAllCheck(users.map((li) => li.id));
      setAcheck(true);
    } else {
      setAllCheck([]);
      setAcheck(false);
    }
  };

  const handelSingleCheck = (e) => {
    const { id, checked } = e.target;
    console.log(checked);
    setAllCheck([...allCheck, parseInt(id)]);
    if (!checked) {
      setAllCheck(allCheck.filter((item) => item !== parseInt(id)));
    }
  };

  const handleCheck = (e) => {
    const { id, checked, name } = e.target;

    updateFunc(id, name, checked);

    console.log(checked);
  };

  return (
    <>
      <table className="table mt-2">
        <thead>
          <tr>
           

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
              Last Status Notes
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


            var team_id = user?.user?.team;

            let dark = "";
            if ( //IR
              user?.gpa &&
              team_id &&
              parseFloat(user.gpa) < 2.5 &&
              team_id == 1
            ) {//TR
              dark = " alert-danger-soft ";
            } else if (
              user?.gpa &&
              team_id &&
              parseFloat(user.gpa) < 13 &&
              team_id == 2
            ) {
              dark = " alert-danger-soft ";
            } else {
              dark = " bg-white";
            }



            return (
              <tr key={key}  className={"border-t pt-2" + dark}>
               
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
                    <Tippy
                      tag="a"
                      href="#"
                      className="tooltip"
                      content={user?.note}
                    >
                      {fText(user?.note)}
                    </Tippy>
                  </div>
                </td>
                <td className="text-center">{user?.follow_up_date}</td>
                <td>{user?.status?.title}</td>
                <td>{user?.ag?.title}</td>
                <td>{user?.package?.title}</td>
                 
                <td className="text-center">{user?.last_contact}</td>
                <td className="text-center">{user?.age}</td>
                <td className="text-center">{user?.gpa}</td>
                <td className="text-center">{user?.last_status_date}</td>

                <td className="text-center">
                  <div className="text-center">
                    <Tippy
                      tag="a"
                      href="#"
                      className="tooltip"
                      content={user?.last_status_notes}
                    >
                      {fText(user?.last_status_notes)}
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
                    <Tippy
                      tag="a"
                      href="#"
                      className="tooltip"
                      content={user?.feedbacks}
                    >
                      {fText(user?.feedbacks)}
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
