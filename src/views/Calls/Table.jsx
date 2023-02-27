import { Tippy, Checkbox, Lucide } from "@/base-components";

import { Link } from "react-router-dom";
import { helper } from "@/utils/helper";
import { useState } from "react";
import CopyEle from "./CopyEle";
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
    setHistory,
    setUserId,
    setDeleteConfirmationModal,
    allCheck,
    setAllCheck,
    updateFunc,
    aheck,
    setAcheck,
    theme,
    dragStart,
    dragover,
    tableDragOver,
    section,
    setting,
  } = props;
  const [rowCount, setRowCount] = useState(20);
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

  const loadMore = () => {
    setRowCount(rowCount + 20);
  };

  return (
    <div className="overflow-auto relative">
       <p className="text-orange-500 text-stone-600"></p>
      <table className="table  mt-2">
        <thead className={theme}>
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
            <th className="text-center whitespace-nowrap">Phone</th>
            <th className="text-center whitespace-nowrap">WhatsApp</th>
            <th className="text-center whitespace-nowrap">Age</th>
            <th className="text-center whitespace-nowrap">GPA</th>
            <th className="text-center whitespace-nowrap">Priority</th>
            <th className="text-center whitespace-nowrap">Referred by</th>
            <th className="text-center whitespace-nowrap">Memo</th>
            <th className="text-center whitespace-nowrap">
              First Contact Date
            </th>
            <th className="text-center whitespace-nowrap">First Call Result</th>
            <th className="text-center whitespace-nowrap">Package</th>
            <th className="text-center whitespace-nowrap">Status</th>

            <th className="text-center whitespace-nowrap">First Call Notes</th>
            <th className="text-center whitespace-nowrap">
              Follow up date set
            </th>
            <th className="text-center whitespace-nowrap">
              Follow Up Call Results
            </th>
            <th className="text-center whitespace-nowrap">
              {" "}
              Cancellation reason
            </th>

            <th className="text-center whitespace-nowrap"> Feedback</th>
          </tr>
        </thead>
        <tbody>
          {users && users.slice(0, rowCount).map((user, key) => {
            let count = key + 1;
            var team_id = user?.user?.team;
            let dark = "";
            if (
              // IR
              user?.gpa &&
              team_id &&
              parseFloat(user.gpa) < 2.5 &&
              team_id == 1
            ) {
              dark = " alert-danger-soft ";
            } else if (
              // TR
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
              <tr
                key={key}
                className={"border-t pt-2" + dark}
                draggable={true}
                onDragStart={(e) => dragStart(e, user.id)}
                // onDragOver={(e) => dragover(e)}
              >
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
                  <Link
                    to="#"
                    draggable={false}
                    className="font-medium whitespace-nowrap"
                  >
                    {user.first_name} {user.last_name}
                  </Link>
                  <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                  
                    <CopyEle email={user.email} />
                  </div>
                </td>

                <td>{user?.phone_number}</td>
                <td>{user?.whatsapp}</td>

                <td className="text-center">{user?.age}</td>
                <td className="text-center">{user?.gpa}</td>
                <td className="text-center">
                  <select
                    onChange={(e) => handelChange(e, user.id, "n")}
                    name="priority"
                    className="form-select form-select-sm mt-2 w-20"
                    defaultValue={user?.priority?.id}
                  >
                    <option value="0">Select..</option>

                    {setting.priorities &&
                      setting.priorities.map((val, indx) => (
                        <option key={indx} value={val?.id}>
                          {val?.title}
                        </option>
                      ))}
                  </select>
                </td>
                <td className="text-center">{user?.referred_by}</td>

                <td
                  className="text-center"
                  onClick={() => setHistory("memo", user.extra, user.id)}
                >
                  <div className="text-center">
                    <Tippy
                      tag="a"
                      href="#"
                      className="tooltip"
                      content={user?.memo}
                    >
                      {fText(user?.memo)}
                    </Tippy>
                  </div>
                </td>
                <td className="text-center">
                  {helper.formatDate(user?.first_contact, "MMM D, YYYY")}{" "}
                </td>
                <td className="text-center">{user?.results?.title}</td>
                <td>
                  <select
                    onChange={(e) => handelChange(e, user.id, "n")}
                    name="package"
                    className="form-select form-select-sm mt-2 w-20"
                    defaultValue={user?.package?.id}
                  >
                    <option value="0">Select..</option>

                    {setting.packages &&
                      setting.packages.map((val, indx) => (
                        <option key={indx} value={val?.id}>
                          {val?.title}
                        </option>
                      ))}
                  </select>
                </td>
                <td>
                  <select
                    onChange={(e) => handelChange(e, user.id, "n")}
                    name="status"
                    className="form-select form-select-sm mt-2 w-20"
                    defaultValue={user?.status?.id}
                  >
                    <option value="0">Select..</option>

                    {setting.status &&
                      setting.status.map((val, indx) => (
                        <option key={indx} value={val?.id}>
                          {val?.title}
                        </option>
                      ))}
                  </select>
                </td>
                <td
                  onClick={() =>
                    setHistory("last_status_notes", user.extra, user.id)
                  }
                  className="text-center"
                >
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
                <td className="text-center">
                  {helper.formatDate(user?.follow_up_date, "MMM D, YYYY")}
                </td>
                <td className="text-center">
                  {user?.follow_up_call_results?.title}
                </td>

                <td>
                  <select
                    onChange={(e) => handelChange(e, user.id, "n")}
                    name="cancel_reason"
                    className="form-select form-select-sm mt-2 w-full"
                    defaultValue={user?.cancel_reason?.id}
                  >
                    <option value="0">Select.. </option>

                    {setting.cancel_reason &&
                      setting.cancel_reason.map((val, indx) => (
                        <option key={indx} value={val?.id}>
                          {val?.title}
                        </option>
                      ))}
                  </select>
                </td>
                <td
                  className="text-center"
                  onClick={() => setHistory("feedbacks", user.extra, user.id)}
                >
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
      {users && rowCount < users.length && (
        <button className="btn btn-default m-5" onClick={loadMore}>
          Load more ...
        </button>
      )}
    </div>
  );
};

export default UsersTable;
