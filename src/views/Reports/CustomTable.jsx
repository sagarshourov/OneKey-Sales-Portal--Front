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

  return (
    <>
      <table className="table mt-2">
        <thead>
          <tr>
            <th className="whitespace-nowrap">No</th>

            {cols !== null &&
              cols.map((val, index) => (
                <th
                  key={index}
                  className="whitespace-nowrap text-center capitalize"
                >
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
                  cols.map((val, index) => {
                    if (val.value == "assigned_to") {
                      console.log("assign to");
                      return (
                        user[val.value] !== null ? (
                          <td key={index} className="text-center">
                            {user[val.value].first_name}{" "}
                            {user[val.value].last_name}
                          </td>
                        ):<td key={index} className="text-center"></td>
                      );
                    }

                    return user[val.value] !== null && user[val.value].title ? (
                      <td key={index} className="text-center">
                        {user[val.value].title}
                      </td>
                    ) : (
                      <td key={index} className="text-center">
                        {user[val.value]}
                      </td>
                    );
                  })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default CustomTable;
