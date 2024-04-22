import { GrMultimedia } from "react-icons/gr";
import FormInput from "../component/FormInput";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants";
import { Zoom, toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setformData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [afterBlur, setAfterBlur] = useState({
    email: false,
    password: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!errors.email && !errors.password) {
        const response = await fetch(BASE_URL + `/v1/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        localStorage.setItem("token", data?.access_token);
        if (!response.ok) {
          throw new Error("Error Signing in");
        }
        setformData({
          email: "",
          password: "",
          confirmPassword: "",
        });
        toast.success(`Welcome ${formData.email} `, {
          transition: Zoom,
        });
        navigate("/");
      } else {
        if (errors.email) toast.error(errors.email, { transition: Zoom });
        if (errors.password) toast.error(errors.password, { transition: Zoom });
      }
    } catch (error) {
      toast.error(error.message, { transition: Zoom });
      // console.log(error.message);
    }
  };

  const validateEmail = () => {
    if (!formData.email.trim()) {
      setErrors((prevError) => ({
        ...prevError,
        email: "Can't be empty",
      }));
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors((prevError) => ({
        ...prevError,
        email: "Invalid email address",
      }));
    } else setErrors((prevError) => ({ ...prevError, email: "" }));
    setAfterBlur((prev) => ({ ...prev, email: true }));
  };

  const validatePassword = () => {
    if (!formData.password.trim()) {
      setErrors((prevError) => ({
        ...prevError,
        password: "Can't be empty",
      }));
    } else if (formData.password.trim().length < 8) {
      setErrors((prevError) => ({
        ...prevError,
        password: "minimum 8 characters",
      }));
    } else {
      setErrors((prevError) => ({ ...prevError, password: "" }));
    }
    setAfterBlur((prev) => ({ ...prev, password: true }));
  };

  const inputFields = [
    {
      id: 10,
      name: "email",
      type: "email",
      placeholder: "Email Address",
      required: true,
      onBlur: validateEmail,
      autoFocus: true,
    },
    {
      id: 11,
      name: "password",
      type: "password",
      placeholder: "Password",
      minLength: 8,
      required: true,
      onBlur: validatePassword,
    },
  ];
  return (
    <div className="container">
      <div className="logo">
        <GrMultimedia style={{ scale: "2", marginTop: "1rem" }} />
      </div>
      <div className="loginContainer">
        <h2 className="h2heading">Login</h2>
        <form>
          {inputFields.map((input) => (
            <FormInput
              key={input.id}
              {...input}
              errorMessage={errors[input.name]}
              value={formData[input.name]}
              onChange={handleChange}
              blur={afterBlur[input.name]}
            />
          ))}
          <button type="submit" className="" onClick={handleSubmit}>
            Login to your account
          </button>
          <p>
            Don't have an account?{" "}
            <Link to="/signup">
              <span>Sign up</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
