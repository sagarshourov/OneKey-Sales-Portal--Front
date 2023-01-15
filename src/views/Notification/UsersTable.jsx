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

const UsersTable = (props) => {
  const { users, rowCount, handelView, setDeleteConfirmationModal, setNotiId } =
    props;

  return (
    <>
      <table className="table table-report  mt-2">
        <thead>
          <tr>
            <th className="whitespace-nowrap">No</th>
            <th className="whitespace-nowrap">Type</th>
            <th className="whitespace-nowrap">Notifications</th>
            <th className="whitespace-nowrap">From</th>

            <th className="whitespace-nowrap"></th>
          </tr>
        </thead>
        <tbody>
          {users.slice(0, rowCount).map((user, key) => {
            let count = key + 1;

            var row_color = "bg-white";

            if (user.is_read == null) {
              row_color = "alert-success-soft ";
            }

            return (
              <tr key={key} className={"intro-x border-t " + row_color}>
                <td className="w-40">{count}</td>
                <td>{user?.types?.title}</td>
                <td className="">{user.content}</td>

                <td>
                  {user.user && (
                    <Link
                      className="flex items-center text-info mr-3"
                      to={"/profile/" + user?.user?.id}
                    >
                      <Lucide icon="User" className="w-4 h-4 mr-1 " />{" "}
                      {user.user.first_name} {user.user.last_name}
                    </Link>
                  )}
                </td>
                <td className="table-report__action w-56">
                  <div className="flex justify-center items-center">
                    <button
                      className="flex items-center text-info mr-3"
                      onClick={(e) => handelView(user)}
                    >
                      <Lucide icon="Info" className="w-4 h-4 mr-1 " /> View
                    </button>

                    <a
                      onClick={(e) => {
                        setNotiId(user?.id);
                        setDeleteConfirmationModal(true);
                      }}
                      className="flex items-center text-danger"
                      href="#"
                    >
                      <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
                    </a>
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
