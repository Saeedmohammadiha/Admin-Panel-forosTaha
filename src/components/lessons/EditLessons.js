import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
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

const Editlessons = () => {
  const navigate = useNavigate()
  const params = useParams();
  const [inputText, setInputText] = useState();
  const [id, setId] = useState(params.id);
  let [loading, setLoading] = useState(true);
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
   * seting the input state to the value of the item that user wants to edit
   *
   */
  useEffect(() => {
    baseUrl
      .get(`/api/v1/lessons/${id}/edit`)
      .then((response) => {
        setInputText(response.data.data.data.name);
        setLoading(false);
        let itemSelected = response.data.data.data.book;
        let item = { value: itemSelected.id, label: itemSelected.name };
        setSelectedOption(item);

        let subItemSelected = response.data.data.data.subject;
        let subItem = {
          value: subItemSelected.id,
          label: subItemSelected.name,
        };
        setSelectedSubjectOption(subItem);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);
  /**
   * getting the options of selects
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
        const subOptions = response.data.data.subject.map((subOptions) => {
          return { value: subOptions.id, label: subOptions.name };
        });
        setSubjectOptions(subOptions);
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

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };
  const handleChangeSubject = (selectedSubjectOption) => {
    setSelectedSubjectOption(selectedSubjectOption);
  };
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
        title: "لطفا درس را وارد کنید",
        icon: "error",
      }).then(() => {
        setButLoading(false)
      })
    } else {
      baseUrl
        .put(`/api/v1/lessons/${id}`, {
          name: inputText,
          book_id: selectedOption.value,
          subject_id: selectedSubjectOption.value,
        })
        .then((response) => {
          MySwal.fire({
            confirmButtonText: "باشه",
            title: "ویرایش شد ",
            icon: "success",
          }).then((response) => {
            setTimeout(navigate("/lessons"), 1000);
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
                <h2 className="text-center mb-3">ویرایش دروس</h2>
                <form
                  className="d-flex flex-column align-items-center"
                  onSubmit={handleSubmit}
                >
                  <input
                    autoFocus
                    className="form-control col-6 m-auto mt-4"
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

export default Editlessons;
