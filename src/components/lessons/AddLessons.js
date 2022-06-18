import React, { useEffect, useState } from "react";
import { override } from "../../css/override";

import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Select from "react-select";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { baseUrl } from "../../baseUrl";
import { errorsCatch } from "../login/errorsCatch";
import { useNavigate } from "react-router";

const AddLessons = () => {
  const navigate = useNavigate()
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookOptions, setBookOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [selectedSubjectOption, setSelectedSubjectOption] = useState();
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
   * geting the options of the select book element from api and setting to state
   *
   */

  useEffect(() => {
    baseUrl
      .get("/api/v1/lessons/create")
      .then((response) => {
        const options = response.data.data.book.map((option) => {
          return { value: option.id, label: option.name };
        });
        setBookOptions(options);
        const subjetcOptions = response.data.data.subject.map((subOption) => {
          return { value: subOption.id, label: subOption.name };
        });
        setSubjectOptions(subjetcOptions);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          localStorage.clear()
          navigate('/')
        }
        if (err.response.status === 403) {
          navigate('/FourOThree')
        }
      });
  }, []);
  /**
   * selecting the item of the select book element and store it in state
   *
   * @param {obj} selectedOption
   */
  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  /**
   * sellected item of the select subject that is stored in state
   *
   * @param {obj} selectedSubjectOption
   */
  const handleChangeSubject = (selectedSubjectOption) => {
    setSelectedSubjectOption(selectedSubjectOption);
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
        title: "لطفا درس را وارد کنید",
        icon: "error",
      }).then(() => {
        setButLoading(false)
      })
    } else {
      baseUrl
        .post("/api/v1/lessons", {
          name: inputText,
          book_id: selectedOption.value,
          subject_id: selectedSubjectOption.value,
        })
        .then((response) => {
          const MySwal = withReactContent(Swal);
          MySwal.fire({
            confirmButtonText: "باشه",
            title: "اضافه شد ",
            icon: "success",
          }).then((response) => {
            setLoading(true);
            setTimeout(navigate("/lessons"), 2000);
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
                <h2 className="text-center mb-3">افزودن درس</h2>
                <form
                  className="d-flex flex-column align-items-center"
                  onSubmit={handleSubmit}
                >
                  <input
                    autoFocus
                    className="form-control col-6  m-auto "
                    type="text"
                    placeholder="درس"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <Select
                    options={bookOptions}
                    placeholder="نام کتاب"
                    value={selectedOption}
                    onChange={handleChange}
                    name="books"
                    className="basic-multi-select pt-3 text-right col-6 m-auto"
                    classNamePrefix="select"
                  />
                  <Select
                    options={subjectOptions}
                    placeholder="مبحث"
                    value={selectedSubjectOption}
                    onChange={handleChangeSubject}
                    name="books"
                    className="basic-multi-select pt-3 text-right col-6 m-auto"
                    classNamePrefix="select"
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

export default AddLessons;
