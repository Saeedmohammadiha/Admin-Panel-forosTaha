import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";
import { override } from "../../css/override";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { baseUrl } from "../../baseUrl";
import { errorsCatch } from "../login/errorsCatch";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";


const EditBooks = () => {
  const params = useParams();
  const [inputText, setInputText] = useState();
  const [id, setId] = useState(params.id);
  let [loading, setLoading] = useState(true);
  const [butLoading, setButLoading] = useState(false)

  const butOverride = css`
  display: block;
  text-align: center;
  `;
  /**
   * controling the collapse and toggle in sidebar
   */
  const [collapse, setCollapse] = useState(false);
  const [toggled, setToggled] = useState(false);

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };
  /**
   * seting the input state to the value of the item that user wants to edit
   *
   */
  useEffect(() => {
    baseUrl
      .get(`/api/v1/books/${id}/edit`)
      .then((response) => {
        setInputText(response.data.data.data.name);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.status == 401) {
          window.location.href = '/'
        }
        if (err.response.status == 403) {
          window.location.href = '/FourOThree'
        }
      });
  }, []);
  /**
   * editing the item with put request
   *
   * @param {event obj} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setButLoading(true)
    const MySwal = withReactContent(Swal);
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    if (!inputText) {
      MySwal.fire({
        confirmButtonText: "باشه",
        title: "لطفا نام کتاب را وارد کنید",
        icon: "error",
      }).then(() => {
        setButLoading(false)
      })
    } else {
      baseUrl
        .put(`/api/v1/books/${id}`, { name: inputText })
        .then((response) => {
          MySwal.fire({
            confirmButtonText: "باشه",
            title: "ویرایش شد ",
            icon: "success",
          }).then((response) => {
            setTimeout((window.location.pathname = "/books"), 1000);
          });
        })
        .catch((err) => {
          errorsCatch(err.response.data);
          setButLoading(false)
        });
    }
  };

  /**
   * this is a conditional rendering function that is going to show or doesn't the loading icon
   *
   * @returns the loading icon or the page
   */

  const useLoading = () => {
    if (loading) {
      return (
        <BeatLoader color="gray" loading={loading} size={35} css={override} />
      );
    } else {
      return (
        <>
          <div className="d-flex">
            <Sidebar
              handleToggleSidebar={handleToggleSidebar}
              collapse={collapse}
              setCollapse={setCollapse}
              toggled={toggled}
              setToggled={setToggled}
            />
            <div className="w-100 p-2">
              <Navbar
                collapse={collapse}
                setCollapse={setCollapse}
                toggled={toggled}
                setToggled={setToggled}
              />
              <div className="col-12 h-75 p-4 light rounded shadow bg-light">
                <h2 className="text-center mb-3">ویرایش نام کتاب</h2>
                <form
                  className="d-flex flex-column align-items-center"
                  onSubmit={handleSubmit}
                >
                  <input
                    autoFocus
                    className="form-control col-6 m-auto mt-4"
                    type="text"
                    placeholder="کتاب"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <br></br>
                  <br></br>
                  <button
                    className="btn btn-outline-warning col-2 m-auto"
                    type="submit"
                    disabled={butLoading ? true : false}
                  >
                    {butLoading ? <BeatLoader color="yellow" loading={butLoading} size={8} css={butOverride} /> : <span>ویرایش<i className="fas fa-plus mr-2"></i></span>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  return <>{useLoading()}</>;
};

export default EditBooks;