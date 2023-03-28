import { Lucide, Tippy, LoadingIcon, Checkbox } from "@/base-components";

import { Link } from "react-router-dom";
import CopyEle from "../Calls/CopyEle";

import { helper } from "@/utils/helper";

const fText = (text) => {
  return text ? text.substr(0, 10) + "..." : "";
};

const UsersTable = (props) => {
  const { users, rowCount } = props;

  return (
    <>
      <table className="table  mt-2">
        <thead>
          <tr>
            <th className="whitespace-nowrap">No</th>
            <th className="whitespace-nowrap">Client</th>
            {/* <th className="text-center whitespace-nowrap">Phone</th> */}
            <th className="text-center whitespace-nowrap">WhatsApp</th>
            <th className="text-center whitespace-nowrap">Age</th>
            <th className="text-center whitespace-nowrap">Case Type</th>
            {/* <th className="text-center whitespace-nowrap">GPA</th> */}
            {/* <th className="text-center whitespace-nowrap">Priority</th> */}
            {/* <th className="text-center whitespace-nowrap">Referred by</th>
            <th className="text-center whitespace-nowrap">Memo</th> */}
            <th className="text-center whitespace-nowrap">
              Call Schedule Date
            </th>
            <th className="text-center whitespace-nowrap">Next steps</th>
            <th className="text-center whitespace-nowrap">Package</th>
            <th className="text-center whitespace-nowrap">Status</th>

            <th className="text-center whitespace-nowrap">First Call Notes</th>
            <th className="text-center whitespace-nowrap">
              Follow up date set
            </th>
            <th className="text-center whitespace-nowrap">
              Follow up call notes
            </th>

            <th className="text-center whitespace-nowrap">Agreement Sent</th>
            <th className="text-center whitespace-nowrap">Agreement Signed</th>

            {/* <th className="text-center whitespace-nowrap">
              {" "}
              Cancellation reason
            </th> */}

            <th className="text-center whitespace-nowrap"> Feedback</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.slice(0, rowCount).map((user, key) => {
              let count = key + 1;
              let dark = " bg-white ";

              var is_admin = 0;

              user.history &&
                user.history.map((data, index) => {
                  if (data.field == "feedbacks") {
                    is_admin = data.user.is_admin;

                    //console.log(user.id + "=is_admin", is_admin);
                  }
                });

              if (is_admin === 1) {
                dark = " alert-warning-soft ";
              } else if (is_admin == 2) {
                dark = " alert-success-soft ";
              }

              // var team_id = user?.user?.team;
              // if (
              //   // IR
              //   user?.gpa &&
              //   team_id &&
              //   parseFloat(user.gpa) < 2.5 &&
              //   team_id == 1
              // ) {
              //   dark = " alert-danger-soft ";
              // } else if (
              //   // TR
              //   user?.gpa &&
              //   team_id &&
              //   parseFloat(user.gpa) < 13 &&
              //   team_id == 2
              // ) {
              //   dark = " alert-danger-soft ";
              // } else {
              //   dark = " bg-white";
              // }

              return (
                <tr
                  key={key}
                  className={"border-t pt-2" + dark}
                  draggable={true}
                  onDragStart={(e) => dragStart(e, user.id)}
                  // onDragOver={(e) => dragover(e)}
                >
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

                  {/* <td>{user?.phone_number}</td> */}
                  <td>{user?.whatsapp}</td>

                  <td className="text-center">{user?.age}</td>

                  <td className="text-center">
                    {user?.case_type == 1 && "F-1"}{" "}
                    {user?.case_type == 2 && "F-1/F2"}
                  </td>

                  <td className="text-center">
                    {user?.call_schedule_date &&
                      helper.formatDate(
                        user?.call_schedule_date,
                        "MMM D, YYYY"
                      )}{" "}
                  </td>
                  <td className="text-center">{user?.next_step}</td>
                  <td>{user?.package?.title}</td>
                  <td>{user?.statu?.title}</td>
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
                  <td className="text-center">
                    {user?.follow_up_date &&
                      helper.formatDate(user?.follow_up_date, "MMM D, YYYY")}
                  </td>

                  <td className="text-center">
                    <div className="text-center">
                      <Tippy
                        tag="a"
                        href="#"
                        className="tooltip"
                        content={user?.follow_up_notes}
                      >
                        {fText(user?.follow_up_notes)}
                      </Tippy>
                    </div>
                  </td>

                  <td className="text-center">
                    {user.ag === 0 ? "No" : "Yes"}
                  </td>

                  <td className="text-center">
                    {user.agreed_to_signed === 0 ? "No" : "Yes"}
                  </td>


                  

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
