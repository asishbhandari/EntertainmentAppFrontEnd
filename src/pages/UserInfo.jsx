import React, { useEffect, useRef, useState } from "react";
import "../css/userInfo.css";
import profileImage from "../assets/defaultUser.svg";
import { useDispatch } from "react-redux";
import { clearState, updateUser, addProfilePhoto } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants";
import { Zoom, toast } from "react-toastify";

const UserInfo = () => {
  // making a ref for the input type file to use on the image tag
  const profileImageRef = useRef(null);

  // getting user details from the redux store
  // const userDetails = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [imageSrc, setImageSrc] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  // setting all the input values that are present in the store
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  // handling the input changes for input fields
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  // handing api call to update the user data to database
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (profilePicture) {
        const formData = new FormData();
        formData.append("email", userInfo.email);
        formData.append("profilePicture", profilePicture);
        const res = await fetch(BASE_URL + "/v1/user/updatePhoto", {
          method: "PATCH",
          headers: {
            authorization: `${localStorage.getItem("token")}`,
          },
          body: formData,
        });
        const data = await res.json();
        toast.success("Profile Photo Updated", { transition: Zoom });
        dispatch(addProfilePhoto(data?.profilePicture));
        setImageSrc(data?.profilePicture);
      }
      const response = await fetch(BASE_URL + "/v1/user/update", {
        method: "PATCH",
        headers: {
          authorization: `${localStorage.getItem("token")}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });
      // const data = await response.json();
      if (response.ok) {
        toast.success("Updated Successfully", { transition: Zoom });
        const resp = await fetch(BASE_URL + "/v1/user/info", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `${localStorage.getItem("token")}`,
          },
        });
        const data = await resp.json();
        // dispatch an action to store userinfo in the redux state
        dispatch(updateUser(data[0]));
      }
      // show updated message on ui using toaster
      if (!response.ok) {
        throw new Error("Error updating user");
      }
    } catch (error) {
      toast.error(error.message, { transition: Zoom });
      console.log(error.message);
    }
  };

  // created a input ref on image tag on click
  const createProfileImageRef = () => {
    profileImageRef.current.click();
  };

  // getting the image file from user
  const setProfileImage = (event) => {
    setProfilePicture(event.target.files[0]);
  };

  // user logout handling
  const handleLogOut = () => {
    dispatch(clearState());
    localStorage.removeItem("token");
    navigate("/login");
    toast.info("logged Out", { transition: Zoom });
  };

  // useEffect to update the state with user info from database using api call
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await fetch(BASE_URL + "/v1/user/info", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        // dispatch an action to store userinfo in the redux state
        dispatch(updateUser(data[0]));
        const updateData = {
          firstName: data[0]?.firstName,
          lastName: data[0]?.lastName,
          email: data[0]?.email,
          street: data[0]?.billingAddress?.street,
          city: data[0]?.billingAddress?.city,
          state: data[0]?.billingAddress?.state,
          country: data[0]?.billingAddress?.country,
          zipCode: data[0]?.billingAddress?.zipCode,
        };
        setUserInfo(updateData);
        setImageSrc(data[0].profilePicture);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getUserInfo();
  }, [dispatch]);

  return (
    <div className="userInfoSection">
      <h2>User Details</h2>
      <div className="userInfoDiv">
        <form encType="multipart/form-data" onSubmit={handleSubmit} noValidate>
          <div className="userInfoForm">
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={userInfo.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={userInfo.lastName}
              placeholder="Last Name"
              onChange={handleChange}
            />
          </div>
          <div className="userInfoForm">
            <input
              type="email"
              name="email"
              id="email"
              value={userInfo.email}
              readOnly
              placeholder="Email"
              onChange={handleChange}
            />
            <input
              type="file"
              id="file"
              ref={profileImageRef}
              onChange={setProfileImage}
            />
          </div>
          <span
            style={{
              color: "#ffffff",
              alignSelf: "start",
              fontSize: "12px",
              paddingLeft: "10px",
              paddingTop: "10px",
            }}
          >
            Billing Address
          </span>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <input
              type="text"
              name="street"
              id="street"
              value={userInfo.street}
              placeholder="street"
              onChange={handleChange}
              style={{ width: "100%" }}
            />
            <div className="userInfoForm">
              <input
                type="text"
                id="city"
                name="city"
                value={userInfo.city}
                onChange={handleChange}
                placeholder="City"
              />
              <input
                type="text"
                name="state"
                id="state"
                value={userInfo?.state}
                onChange={handleChange}
                placeholder="State"
              />
            </div>
            <div className="userInfoForm">
              <input
                type="text"
                name="country"
                id="country"
                value={userInfo.country}
                onChange={handleChange}
                placeholder="Country"
              />
              <input
                type="number"
                name="zipCode"
                id="zipCode"
                value={userInfo.zipCode}
                onChange={handleChange}
                placeholder="Zip Code"
              />
            </div>
          </div>
          <button className="updateBtn" type="submit">
            Update
          </button>
        </form>
        <div>
          <img
            src={imageSrc || profileImage}
            alt="profilePicture"
            id="profilePicture"
            onClick={createProfileImageRef}
            className="profilePicture"
          />
        </div>
      </div>
      <div
        style={{ maxWidth: "800px", display: "flex", justifyContent: "end" }}
      >
        <button style={{ maxWidth: "100px" }} onClick={handleLogOut}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserInfo;
