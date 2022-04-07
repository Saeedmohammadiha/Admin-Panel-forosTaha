import { useState, useEffect } from "react";
import { baseUrl } from "../../baseUrl";

import { errorsCatch } from "./errorsCatch";

const useForm = (validate , setLoading ) => {
  const [values, setValues] = useState({
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  /**
   * this function handles the change event on both phone and password inputs.
   * ita takes the event object as a param and sets value state
   * name is the name attribute of input
   *
   * @param {event object} e
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  /**
   * this function handles the submit event on form.
   * ita takes the event object as a param and if ther was no error is sends a get request to api and as response takes a token and saves it in local storage
   * and then sends a post request to api with username and password and logs the user in
   * if there is an error from api it sets the error in error state
   * the catch part hadle with catcherror function imported from other file
   *  
   * @param {event object} e
   */

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(values);
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      setLoading(true)
    }
/**
 * validates the inputs before sending to server
 *  
 */
   

    if (Object.keys(errors).length === 0) {
      baseUrl.get("/sanctum/csrf-cookie").then((response) => {
        baseUrl
          .post("/api/v1/admin-login", values)
          .then((response) => {
            let token = response.data.data.token;
            localStorage.setItem("token", token);
            localStorage.setItem(
              "user",
              JSON.stringify(response.data.data.user)
            );
            window.location.pathname = "/dashboard";
          })
          .catch((err) => {
            errorsCatch(err.response.data);
            setLoading(false)
          });
      });
    }
  };

  return { handleChange, values, handleSubmit, errors };
};

export default useForm;
