import { Lucide, Litepicker, Input } from "@/base-components";

import { useState } from "react";
const SupposeSection = (props) => {
  // const { index, data, setting, deleteFollowUp, handelSelect, onChange } =
  //   props;

  //console.log("followup", data);

  return (
    <div className=" p-5 md:mt-5   bg-slate-100 dark:bg-gray-900 relative">
      <h3 className="text-xl pb-5 text-center font-bold dark:text-white">
        Suppose Information
      </h3>
      <div className="grid grid-cols-4  gap-4 ">
        <div className="intro-x ">
          <label className="form-label">First Name </label>
          <input
            type="text"
            className="form-control"
            name={"suppose[0][first_name]"}
          />
        </div>
        <div className="intro-x ">
          <label className="form-label">Last Name </label>
          <input type="text" className="form-control"  name={"suppose[0][last_name]"} />
        </div>
        <div className="intro-x ">
          <label className="form-label"> Last level of education </label>
          <input type="text" className="form-control"  name={"suppose[0][degree]"} />
        </div>
        <div className="intro-x ">
          <label className="form-label">GPA </label>
          <input type="text" className="form-control" name={"suppose[0][gpa]"} />
        </div>
      </div>
    </div>
  );
};

export default SupposeSection;
