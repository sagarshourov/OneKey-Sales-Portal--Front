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

const CustomTable = (props) => {
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
    cols,
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

            {cols !== null &&
              cols.map((val, index) => (
                <th key={index} className="whitespace-nowrap text-center capitalize">
                  {val.label}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {users.slice(0, rowCount).map((user, key) => {
            let count = key + 1;

            var team_id = user?.user?.team;

            let dark = "";
            if (
              user?.gpa &&
              team_id &&
              parseFloat(user.gpa) < 2.5 &&
              team_id == 2
            ) {
              dark = " alert-danger-soft ";
            } else if (
              user?.gpa &&
              team_id &&
              parseFloat(user.gpa) < 13 &&
              team_id == 1
            ) {
              dark = " alert-danger-soft ";
            } else {
              dark = " bg-white";
            }

            return (
              <tr key={key} className={"border-t pt-2" + dark}>
                <td className="w-40">{count}</td>

                {cols !== null &&
                  cols.map((val, index) =>
                    user[val.value] !== null && user[val.value].title ? (
                      <td key={index} className="text-center">
                        {user[val.value].title}
                      </td>
                    ) : (
                      <td key={index} className="text-center">
                        {user[val.value]}
                      </td>
                    )
                  )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default CustomTable;
