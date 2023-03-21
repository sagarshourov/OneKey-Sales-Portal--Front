import { useState, useRef } from "react";
import {
  Lucide,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownContent,
  DropdownItem,
  DropdownDivider,
  Modal,
  Alert,
  ModalBody,
} from "@/base-components";
import axios from "axios";
import dom from "@left4code/tw-starter/dist/js/dom";
import * as $_ from "lodash";
import classnames from "classnames";
import PropTypes from "prop-types";
import { getBaseApi, adminApi } from "../../configuration";
import { Link, useNavigate } from "react-router-dom";
import { first } from "lodash";

import { loginState } from "../../state/login-atom";
import { authHeader } from "../../service/auth-header";
import { useRecoilState, useRecoilValue } from "recoil";

const Logout = (props) => {
  const [loginsta, setLoginState] = useRecoilState(loginState);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(true);
  const [headers, setToken] = useState(authHeader());
  let navigate = useNavigate();
  const handelLogout = () => {
    //useResetRecoilState(loginState);
    localStorage.clear();

    setLoginState({});

    // useResetRecoilState(allUsersState);

    navigate("/login", { replace: true });
    window.location.reload();
  };

  const handelProfile = () => {
    navigate("/", { replace: true });
  };

  const handelSwitch = async () => {
    console.log("handel switch");

    setLoading(true);
    const URL = adminApi() + "token/" + loginsta.view;

    try {
      const response = await axios.get(URL, {
        headers,
      });

      //  console.log("response", response);
      if (response?.data?.success) {
        setLoading(false);
        // console.log("vewing 1", response);
        const accessToken = response.data.data.token;
        const roles = response.data.data.user.is_admin;
       
        if (roles == 1) {
          localStorage.setItem("isAdmin", true);
        }

        localStorage.setItem("loggedIn", true);
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(response?.data?.data));

        localStorage.setItem(
          "first_name",
          response?.data?.data?.user?.first_name
        );
        localStorage.setItem(
          "last_name",
          response?.data?.data?.user?.last_name
        );
        if (response.data.data.user.profile_image.file_path) {
          localStorage.setItem(
            "profile_image",
            response.data.data.user.profile_image.file_path
          );
        }
        if (response?.data?.data.user) {
          localStorage.setItem("userId", response?.data?.data?.user?.id);
        }
        localStorage.setItem("view", false);
        localStorage.setItem("role", roles);

        setLoginState({
          profile_image: response.data.data.user.profile_image.file_path,
          email: response.data.data.user.email,
          first_name: response.data.data.user.first_name,
          last_name: response.data.data.user.last_name,
          isAdmin: roles == 1 ? roles : 0,
          role: roles,
          token: accessToken,
          userId: response.data.data.user.id,
          view: false,
        });
        window.location.reload();

        // navigate("../", { replace: true });
      } else {
        alert("Something is wrong please try again later!");
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }

    setAlert(false);
  };

  return (
    <>
      {/* BEGIN: Top Bar */}
      <div className="top-bar ">
        {/* BEGIN: Breadcrumb */}
        <nav aria-label="breadcrumb" className="-intro-x hidden xl:flex">
          <ol className="breadcrumb breadcrumb-light">
            <li className="breadcrumb-item">
              <a href="#">App</a>
            </li>

            <li className="breadcrumb-item active" aria-current="page">
              Dashboard
            </li>
          </ol>
        </nav>

        {/* END: Breadcrumb */}
        {/* BEGIN: Mobile Menu */}
        <div className="-intro-x xl:hidden mr-3 sm:mr-6">
          <div
            className="mobile-menu-toggler cursor-pointer"
            onClick={props.toggleMobileMenu}
          >
            <Lucide
              icon="BarChart2"
              className="mobile-menu-toggler__icon transform rotate-90 dark:text-slate-500"
            />
          </div>
        </div>
        {loginsta.view && loginsta.view !== "false" && (
          <Alert className="alert-pending w-full xl:w-96  ml-1 xl:ml-32 2xl:ml-32 mt-3 flex items-center mb-2">
            {loading ? (
              <h3>Loading...</h3>
            ) : (
              <>
                <Lucide icon="AlertCircle" className="w-6 h-6 mr-2" /> Logged in
                as Employee
                <button
                  type="button"
                  className="btn-close text-white"
                  onClick={handelSwitch}
                  aria-label="Close"
                >
                  <Lucide icon="X" className="w-4 h-4" />
                </button>
              </>
            )}
          </Alert>
        )}
        {/* END: Mobile Menu */}
        {/* BEGIN: Search */}
        <div className="intro-x relative ml-auto sm:mx-auto"></div>
        {/* END: Search */}
        {/* BEGIN: Search Result */}

        {/* END: Search Result */}
        {/* BEGIN: Notifications */}
        <div className="intro-x dropdown mr-5 sm:mr-6">
          <div
            className="dropdown-toggle notification notification--bullet cursor-pointer"
            role="button"
            aria-expanded="false"
            data-tw-toggle="dropdown"
          >
            <Lucide
              icon="Bell"
              className="notification__icon dark:text-slate-500"
            />
          </div>
          <div className="notification-content pt-2 dropdown-menu">
            <div className="notification-content__box dropdown-content">
              <div className="notification-content__title">Notifications</div>
            </div>
          </div>
        </div>
        {/* END: Notifications */}
        {/* BEGIN: Notifications */}

        {/* END: Notifications */}
        {/* BEGIN: Account Menu */}
        <Dropdown className="intro-x text-slate-200 h-10">
          <DropdownToggle
            tag="div"
            role="button"
            className="h-full dropdown-toggle flex items-center"
          >
            <div className="w-10 h-10 image-fit">
              {loginsta.profile_image && (
                <img
                  className="rounded-full border-2 border-white border-opacity-10 shadow-lg"
                  src={getBaseApi() + "file/" + loginsta.profile_image}
                />
              )}
            </div>
            <div className="hidden md:block ml-3">
              <div className="max-w-[7rem] truncate font-medium">
                {loginsta?.first_name} {loginsta?.last_name}
              </div>
              <div className="text-xs text-slate-400">
                {loginsta.role == 1
                  ? "Super Admin"
                  : loginsta.role == 2
                  ? "Admin"
                  : "Employee"}
              </div>
            </div>
          </DropdownToggle>
          <DropdownMenu className="w-56">
            <DropdownContent>
              <DropdownItem onClick={handelProfile}>
                <Lucide icon="User" className="w-4 h-4 mr-2" /> Profile
              </DropdownItem>

              <DropdownDivider />
              <DropdownItem onClick={handelLogout}>
                <Lucide icon="ToggleRight" className="w-4 h-4 mr-2" /> Logout
              </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
        {/* END: Account Menu */}
      </div>
      {/* END: Top Bar */}
    </>
  );
};

Logout.propTypes = {
  toggleMobileMenu: PropTypes.func,
};

export default Logout;
