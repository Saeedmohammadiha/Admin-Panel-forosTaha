import React, { useState } from "react";
import { override } from "../../css/override";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'
import { baseUrl } from "../../baseUrl";
import { errorsCatch } from "../login/errorsCatch";

const AddPermission = () => {
  const [inputText, setInputText] = useState("");
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);
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
   * function that submits the form and sends the value that users wants to add to api
   *
   * @param {event obj} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setButLoading(true)
    if (!inputText) {
      Swal.fire({
        confirmButtonText: "باشه",
        title: "لطفا نام جدید را وارد کنید",
        icon: "error",
      }).then(() => {
        setButLoading(false)
      })
    } else {
      baseUrl
        .post("/api/v1/permission", { name: inputText , label: label  })
        .then((response) => {
          const MySwal = withReactContent(Swal);
          MySwal.fire({
            confirmButtonText: "باشه",
            title: "اضافه شد ",
            icon: "success",
          }).then((response) => {
            setLoading(true);
            setTimeout((window.location.pathname = "/permission"), 2000);
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
                <h2 className="text-center mb-3">افزودن دسترسی</h2>
                <form
                  className="d-flex flex-column align-items-center"
                  onSubmit={handleSubmit}
                >
                  <input
                    autoFocus
                    className="form-control w-50 m-auto"
                    type="text"
                    placeholder="دسترسی"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <br></br>
                  <input
                    
                    className="form-control w-50 m-auto"
                    type="text"
                    placeholder="برچسب"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                  />
                  <br></br>
                  <br></br>

                  <button
                    className="btn btn-outline-success w-25 "
                    type="submit"
                    disabled={butLoading ? true : false}
                  >
                    {butLoading ? <BeatLoader color="green" loading={butLoading} size={8} css={butOverride} /> : <span>افزودن<i className="fas fa-plus mr-2"></i></span>}

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

export default AddPermission;
