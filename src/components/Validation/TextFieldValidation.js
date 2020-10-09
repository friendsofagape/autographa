import * as React from "react";
import { countErrors, validateForm, validEmailRegex } from "./helper";

export const TextFieldValidation = () => {
  const [formValid, setFormValid] = React.useState(false);
  const [errorCount, setErrorCount] = React.useState(null);
  const [errors, setErrors] = React.useState({
    namefield: "",
    password: "",
    email: "",
  });

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case "namefield":
        errors.fullName =
          value.length < 5 ? "Full Name must be 5 characters long!" : "";
        break;
      case "email":
        errors.email = validEmailRegex.test(value) ? "" : "Email is not valid!";
        break;
      case "password":
        errors.password =
          value.length < 8 ? "Password must be 8 characters long!" : "";
        break;
      default:
        break;
    }

    this.setState({ errors, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ formValid: validateForm(this.state.errors) });
    this.setState({ errorCount: countErrors(this.state.errors) });
  };

  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="fullName">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              name="fullName"
              onChange={this.handleChange}
              noValidate
            />
            {errors.namefield.length > 0 && (
              <span className="error">{errors.fullName}</span>
            )}
          </div>
          <div className="email">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              onChange={this.handleChange}
              noValidate
            />
            {errors.email.length > 0 && (
              <span className="error">{errors.email}</span>
            )}
          </div>
          <div className="password">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              onChange={this.handleChange}
              noValidate
            />
            {errors.password.length > 0 && (
              <span className="error">{errors.password}</span>
            )}
          </div>
          <div className="info">
            <small>Password must be eight characters in length.</small>
          </div>
          <div className="submit">
            <button>Create</button>
          </div>
          {this.state.errorCount !== null ? (
            <p className="form-status">
              Form is {formValid ? "valid ✅" : "invalid ❌"}
            </p>
          ) : (
            "Form not submitted"
          )}
        </form>
      </div>
    </div>
  );
};
