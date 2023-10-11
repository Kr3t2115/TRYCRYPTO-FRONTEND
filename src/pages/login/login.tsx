import { useRef } from "react";
import Login from "../../services/login";
import classes from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import Logo from "../../assets/logo.png";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

export default function LoginPage() {
  const { setAuth, setCurrentBalance } = useContext(AuthContext);

  const navigate = useNavigate();

  const inputPassword = useRef<HTMLDivElement>(null);

  document.title = "Login";

  const validateEmail = (value: any) => {
    let error;
    if (!value) {
      error = "Email is required! Fill the following field";
      inputPassword.current?.classList.remove(classes.unHidden);
      return error;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "Invalid email address";
      inputPassword.current?.classList.remove(classes.unHidden);
      return error;
    } else if (value == "") {
      inputPassword.current?.classList.remove(classes.unHidden);
    } else {
      inputPassword.current?.classList.add(classes.unHidden);
    }
  };

  const validatePassword = (value: any) => {
    let error;
    if (!value) {
      error = "Password is required! Fill the following field";
      return error;
    } else if (value == "") {
      error = "Password cannot be empty";
      return error;
    }
  };

  let passwordClasses = classes.hidden + " " + classes.formContainerDiv;

  return (
    <div className={classes.loginMainContainer}>
      <div className={classes.BeforeContainer}>
        <div className={classes.loginContainer}>
          <Link to="/">
            <img src={Logo} alt="logo"></img>
          </Link>

          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            onSubmit={(values) => {
              Login(values, navigate, setAuth, setCurrentBalance);
            }}
          >
            {({ errors, touched }) => (
              <Form className={classes.formContainer}>
                <div className={classes.formContainerDiv}>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Write your email"
                    validate={validateEmail}
                    required
                  />
                  {errors.email && touched.email ? (
                    <div className={classes.error}>{errors.email}</div>
                  ) : null}
                </div>

                <div className={passwordClasses} ref={inputPassword}>
                  <Field
                    name="password"
                    type="password"
                    placeholder="Write your password"
                    required
                  />
                  {errors.password && touched.password ? (
                    <div className={classes.error}>{errors.password}</div>
                  ) : null}
                </div>

                <button type="submit">Login</button>
              </Form>
            )}
          </Formik>

          <Link to="/register">
            If you dont have an account you can register here
          </Link>
        </div>
      </div>

      <div className={classes.loginBg}></div>
    </div>
  );
}
