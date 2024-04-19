import { GrMultimedia } from "react-icons/gr";
import { useState } from "react";
import FormInput from "../component/FormInput";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants";
import { Zoom, toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [afterBlur, setAfterBlur] = useState({
    email: false,
    password: false,
    confirmPassword: false,
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
      if (!errors.email && !errors.password && !errors.confirmPassword) {
        const response = await fetch(BASE_URL + "/v1/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Error Signing in");
        }
        setformData({
          email: "",
          password: "",
          confirmPassword: "",
        });
        toast.success("Successful, Kindly Log In");
        navigate("/login");
      } else {
        if (errors.email) toast.error(errors.email, { transition: Zoom });
        if (errors.password) toast.error(errors.password, { transition: Zoom });
        if (errors.confirmPassword)
          toast.error(errors.confirmPassword, { transition: Zoom });
      }
    } catch (error) {
      toast.error(error.message, { transition: Zoom });
      console.log(error.message);
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

  const validateConfirmPassword = () => {
    if (!formData.confirmPassword.trim()) {
      setErrors((prevError) => ({
        ...prevError,
        confirmPassword: "Can't be empty",
      }));
    } else if (formData.password.trim() !== formData.confirmPassword.trim()) {
      setErrors((prevError) => ({
        ...prevError,
        confirmPassword: "Password does not match",
      }));
    } else {
      setErrors((prevError) => ({ ...prevError, confirmPassword: "" }));
    }
    setAfterBlur((prev) => ({ ...prev, confirmPassword: true }));
  };

  const inputFields = [
    {
      id: 1,
      name: "email",
      type: "email",
      placeholder: "Email Address",
      required: true,
      onBlur: validateEmail,
      autoFocus: true,
    },
    {
      id: 2,
      name: "password",
      type: "password",
      placeholder: "Password",
      minLength: 8,
      required: true,
      onBlur: validatePassword,
    },
    {
      id: 3,
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password ",
      required: true,
      pattern: formData.password,
      onBlur: validateConfirmPassword,
    },
  ];
  return (
    <div className="container">
      <div className="logo">
        <GrMultimedia style={{ scale: "2", marginTop: "1rem" }} />
      </div>
      <div className="loginContainer">
        <h2 className="h2heading">Sign Up</h2>
        <form>
          {inputFields.map((input) => (
            <FormInput
              key={input.id * 5}
              {...input}
              errorMessage={errors[input.name]}
              value={formData[input.name]}
              onChange={handleChange}
              blur={afterBlur[input.name]}
            />
          ))}
          <button type="submit" className="" onClick={handleSubmit}>
            Create an account
          </button>
          <p>
            Already have an account?{" "}
            <Link to="/login">
              <span>Login</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
