import { useRef } from "react";
import classes from "./register.module.css";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { Formik, Form, Field } from "formik";
import RegisterApi from "../../services/register";

export default function Register() {
  document.title = "Register";

  const navigate = useNavigate();

  const inputPassword = useRef<HTMLDivElement>(null);

  const validateEmail = (value: any) => {
    let error;
    if (!value) {
      error = "Email is required! Fill the following field";
      inputPassword.current?.classList.remove("unHidden");
      return error;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "Invalid email address";
      inputPassword.current?.classList.remove("unHidden");
      return error;
    } else if (value == "") {
      inputPassword.current?.classList.remove("unHidden");
    } else {
      inputPassword.current?.classList.add("unHidden");
    }
  };

  const validateName = (value: any) => {
    let error;
    if (!value) {
      error = "Fullname is required! Fill the following field";
      return error;
    } else if (value == "") {
      error = "Fullname cannot be empty";
      return error;
    }
  };

  const validatePassword = (value: any) => {
    let error;
    if (!value) {
      error = "Password is required! Fill the following field";
      return error;
    } else if (
      value.length < 8 ||
      !value.match(/\d/) ||
      !value.match(/[a-z]/) ||
      !value.match(/[A-Z]/)
    ) {
      error = "Password is incorrect";
      return error;
    } else if (value == "") {
      error = "Password cannot be empty";
      return error;
    }
  };

  return (
    <div className={classes.loginMainContainer}>
      <div className={classes.BeforeContainer}>
        <div className={classes.loginContainer}>
          <Link to="/">
            <img src={Logo} alt="logo"></img>
          </Link>

          <Formik
            initialValues={{
              firstname: "",
              lastname: "",
              username: "",
              email: "",
              password: "",
            }}
            onSubmit={(values: any) => {
              RegisterApi(values, navigate);
            }}
          >
            {({ errors, touched }) => (
              <Form className={classes.formContainer}>
                <div className={classes.formContainerDiv}>
                  <Field
                    name="firstname"
                    type="text"
                    placeholder="Write your firstname"
                    validate={validateName}
                  />
                  {errors.firstname && touched.firstname ? (
                    <div className={classes.error}>{errors.firstname}</div>
                  ) : null}
                </div>

                <div className={classes.formContainerDiv}>
                  <Field
                    name="lastname"
                    type="text"
                    placeholder="Write your lastname"
                    validate={validateName}
                  />
                  {errors.lastname && touched.lastname ? (
                    <div className={classes.error}>{errors.lastname}</div>
                  ) : null}
                </div>

                <div className={classes.formContainerDiv}>
                  <Field
                    name="username"
                    type="text"
                    placeholder="Write your username"
                    validate={validateName}
                  />
                  {errors.username && touched.username ? (
                    <div className={classes.error}>{errors.username}</div>
                  ) : null}
                </div>

                <div className={classes.formContainerDiv}>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Write your email"
                    validate={validateEmail}
                  />
                  {errors.email && touched.email ? (
                    <div className={classes.error}>{errors.email}</div>
                  ) : null}
                </div>

                <div className={classes.formContainerDiv} ref={inputPassword}>
                  <Field
                    name="password"
                    type="password"
                    placeholder="Write your password"
                    validate={validatePassword}
                  />
                  {errors.password && touched.password ? (
                    <div className={classes.error}>{errors.password}</div>
                  ) : null}
                </div>

                <button type="submit">Register</button>
              </Form>
            )}
          </Formik>

          <Link to="/login">
            If you already have an account you can login here
          </Link>
        </div>
      </div>

      <div className={classes.loginBg}></div>
    </div>
  );
}
