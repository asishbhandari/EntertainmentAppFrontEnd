import React from "react";
import { FaClapperboard } from "react-icons/fa6";
import { AiFillAppstore } from "react-icons/ai";
import { MdLocalMovies } from "react-icons/md";
import { PiTelevisionFill } from "react-icons/pi";
import { IoBookmark } from "react-icons/io5";
import defaultProfilePicture from "../assets/defaultUser.svg";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const profilePicture = useSelector((state) => state.user.profilePicture);
  return (
    <div className="navbar">
      <FaClapperboard
        className="logoIcon"
        style={{
          marginTop: "2rem",
          marginBottom: "2rem",
          color: "#fc4747",
        }}
      />
      <div className="onlyTabAndMob"></div>
      <NavLink
        to={"/"}
        className={({ isActive, isPending }) =>
          isActive ? "active" : "notActive"
        }
      >
        <AiFillAppstore className="iconSize" />
      </NavLink>
      <NavLink
        to={"/movies"}
        className={({ isActive, isPending }) =>
          isActive ? "active" : "notActive"
        }
      >
        <MdLocalMovies className="iconSize" />
      </NavLink>
      <NavLink
        to={"/tv"}
        className={({ isActive, isPending }) =>
          isActive ? "active" : "notActive"
        }
      >
        <PiTelevisionFill className="iconSize" />
      </NavLink>
      <NavLink
        to={"/bookmark"}
        className={({ isActive, isPending }) =>
          isActive ? "active" : "notActive"
        }
      >
        <IoBookmark className="iconSize" />
      </NavLink>
      <div className="grow"></div>
      <NavLink
        to={"/userinfo"}
        className={({ isActive, isPending }) =>
          isActive ? "active" : "notActive"
        }
      >
        <img
          src={profilePicture || defaultProfilePicture}
          alt="profile_picture"
          className="avatar"
        />
      </NavLink>
    </div>
  );
};

export default Navbar;
