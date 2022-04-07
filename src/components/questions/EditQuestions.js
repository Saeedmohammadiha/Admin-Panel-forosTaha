import React, { useState, useEffect } from "react";
import Select from "react-select";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { errorsCatch } from "../login/errorsCatch";
import { baseUrl } from "../../baseUrl";
import "../../css/fileInput.css";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";
import { override } from "../../css/override";
import { useParams } from "react-router";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const EditQuestions = () => {
  const params = useParams();
  const [id, setId] = useState(params.id);
  let [loading, setLoading] = useState(true);
  const [selectedQuestionImage, setSelectedQuestionImage] = useState(null);
  const [imageUrlQuestion, setImageUrlQuestion] = useState(null);
  const [selectedAnswerImage, setSelectedAnswerImage] = useState(null);
  const [imageUrlAnswer, setImageUrlAnswer] = useState(null);
  const [bookOptions, setBookOptions] = useState([]);
  const [baseOptions, setBaseOptions] = useState([]);
  const [fieldOptions, setFieldOptions] = useState([]);
  const [lessonOptions, setlessonOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [levelOptions, setLevelOptions] = useState([]);
  const [selectedSubjectOption, setSelectedSubjectOption] = useState();
  const [selectedBookOption, setSelectedBookOption] = useState();
  const [selectedCorrectAnswerOption, setSelectedCorrectAnswerOption] =
    useState();
  const [selectedBaseOption, setSelectedBaseOption] = useState();
  const [selectedFieldOption, setSelectedFieldOption] = useState();
  const [selectedLessonOption, setSelectedLessonOption] = useState();
  const [selectedLevelOption, setSelectedLevelOption] = useState();
  const [errorShow, setErrorShow] = useState();
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
  const correctAnswerOptions = [
    { value: "option_a", label: "گزینه A" },
    { value: "option_b", label: "گزینه B" },
    { value: "option_c", label: "گزینه C" },
    { value: "option_d", label: "گزینه D" },
  ];

  /**
   * getting the options of the selects from server
   *
   */
  useEffect(() => {
    baseUrl
      .get("/api/v1/questions/create")
      .then((response) => {
        const base = response.data.data.base;
        const baseOption = base.map((baseitem) => {
          return { value: baseitem.id, label: baseitem.name };
        });
        setBaseOptions(baseOption);
        const book = response.data.data.book;
        const bookOption = book.map((bookitem) => {
          return { value: bookitem.id, label: bookitem.name };
        });
        setBookOptions(bookOption);
        const field = response.data.data.field;
        const fieldOption = field.map((fielditem) => {
          return { value: fielditem.id, label: fielditem.name };
        });
        setFieldOptions(fieldOption);
        const lesson = response.data.data.lesson;
        const lessonOption = lesson.map((lessonitem) => {
          return { value: lessonitem.id, label: lessonitem.name };
        });
        setlessonOptions(lessonOption);
        const subjects = response.data.data.subject;
        const subjectsOption = subjects.map((subjectitem) => {
          return { value: subjectitem.id, label: subjectitem.name };
        });
        setSubjectOptions(subjectsOption);
        const levels = response.data.data.level;
        const levelOption = levels.map((levelitem) => {
          return { value: levelitem.id, label: levelitem.name };
        });
        setLevelOptions(levelOption);
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
   * seting the input state to the value of the item that user wants to edit
   *
   */
  useEffect(() => {
    baseUrl
      .get(`/api/v1/questions/${id}/edit`)
      .then((response) => {
        const data = response.data.data.data;
        setImageUrlQuestion(`https://panel.farostaha.com${data.question}`);
        setImageUrlAnswer(`https://panel.farostaha.com${data.answer}`);
        setSelectedBookOption({ value: data.book.id, label: data.book.name });

        setSelectedSubjectOption({
          value: data.subject.id,
          label: data.subject.name,
        });
        setSelectedBaseOption({ value: data.base.id, label: data.base.name });
        setSelectedLevelOption({
          value: data.level.id,
          label: data.level.name,
        });
        const selectedFieldItem = data.field.map((item) => {
          return { value: item.id, label: item.name };
        });
        setSelectedFieldOption(selectedFieldItem);
        const selectedLessonItem = data.lesson.map((lesson) => {
          return { value: lesson.id, label: lesson.name };
        });
        setSelectedLessonOption(selectedLessonItem);
        if ((data.true_option = "option_a")) {
          setSelectedCorrectAnswerOption({
            value: data.true_option,
            label: "گزینه A",
          });
        } else if ((data.true_option = "option_b")) {
          setSelectedCorrectAnswerOption({
            value: data.true_option,
            label: "گزینه B",
          });
        } else if ((data.true_option = "option_c")) {
          setSelectedCorrectAnswerOption({
            value: data.true_option,
            label: "گزینه C",
          });
        } else if ((data.true_option = "option_d")) {
          setSelectedCorrectAnswerOption({
            value: data.true_option,
            label: "گزینه D",
          });
        }
        setLoading(false);

      })

      .catch((err) => {
        console.log(err);
      });
  }, []);

  /**
   * displaying the image that user selects
   *
   */
  useEffect(() => {
    if (selectedQuestionImage) {
      setImageUrlQuestion(URL.createObjectURL(selectedQuestionImage));
    }
    if (selectedAnswerImage) {
      setImageUrlAnswer(URL.createObjectURL(selectedAnswerImage));
    }
  }, [selectedQuestionImage, selectedAnswerImage]);
  /**
   * saving the image that user selects inside state
   *
   * @param {event obj} e
   */
  const handleQuestionInputChange = (e) => {
    setSelectedQuestionImage(e.target.files[0]);
  };
  /**
   * saving the image that user selects inside state
   *
   * @param {event obj} e
   */
  const handleAnswerInputChange = (e) => {
    setSelectedAnswerImage(e.target.files[0]);
  };

  /**
   * saving the selected option in state
   *
   * @param {event object selected option} selectedBookOption
   */
  const handleChangeBook = (selectedBookOption) => {
    setSelectedBookOption(selectedBookOption);
  };
  const handleChangeSubject = (selectedSubjectOption) => {
    setSelectedSubjectOption(selectedSubjectOption);
  };
  const handleChangeCorrectAnswer = (selectedCorrectAnswerOption) => {
    setSelectedCorrectAnswerOption(selectedCorrectAnswerOption);
  };
  const handleChangeBase = (selectedBaseOption) => {
    setSelectedBaseOption(selectedBaseOption);
  };
  const handleChangeField = (selectedFieldOption) => {
    setSelectedFieldOption(selectedFieldOption);
  };
  const handleChangeLesson = (selectedLessonOption) => {
    setSelectedLessonOption(selectedLessonOption);
  };
  const handleChangeLevel = (selectedLevelOption) => {
    setSelectedLevelOption(selectedLevelOption);
  };

  /**
   * posting the values to server
   *
   * @param {event obj} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setButLoading(true)
    if (
      selectedSubjectOption &&
      selectedBookOption &&
      selectedCorrectAnswerOption &&
      selectedBaseOption &&
      selectedFieldOption &&
      selectedLessonOption &&
      selectedLevelOption
    ) {
      const fieldData = selectedFieldOption.map((field) => {
        return field.value;
      });

      const lessonData = selectedLessonOption.map((lesson) => {
        return lesson.value;
      });
      setErrorShow(false);
      const formData = new FormData();
      formData.append("question", selectedQuestionImage);
      formData.append("answer", selectedAnswerImage);
      formData.append("subject_id", selectedSubjectOption.value);
      formData.append("book_id", selectedBookOption.value);
      formData.append("true_option", selectedCorrectAnswerOption.value);
      formData.append("base_id", selectedBaseOption.value);
      formData.append("field_id", JSON.stringify(fieldData));
      formData.append("lesson_id", JSON.stringify(lessonData));
      formData.append("level_id", selectedLevelOption.value);
      formData.append("_method", "PUT");
      setLoading(true);

      baseUrl
        //.put(`/api/v1/questions/${id}`, { params: { data: formData }, headers: { "Content-Type": "multipart/form-data" } })
        .post(`/api/v1/questions/${id}`, formData)
        .then((response) => {
          setLoading(false);
          const MySwal = withReactContent(Swal);
          MySwal.fire({
            confirmButtonText: "باشه",
            title: "ویرایش شد ",
            icon: "success",
          }).then((response) => {
            setTimeout((window.location.pathname = "/questions"), 1000);
          });
        })
        .catch((err) => {
          errorsCatch(err.response.data);
          setLoading(false);
          setButLoading(false)
        });
    } else {
      setErrorShow(true);
      setButLoading(false)

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
              <h5 className="text-right mb-2">افزودن سوالات</h5>
              <div className="col-12 h-100 p-4 light rounded shadow bg-light">
                <div className="form-container">
                  <form onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-around flex-column file-input-container">
                      <div className="center m-2 p-2 col-12 d-flex  flex-column justify-content-around align-items-center rounded shadow  ">
                        <div className="title">
                          <h5>تصویر سوال </h5>
                        </div>

                        <div className="dropzone fa-4x">
                          {imageUrlQuestion && (
                            <img
                              src={imageUrlQuestion}
                              alt=""
                              className="w-50 h-100"
                            />
                          )}

                          <input
                            type="file"
                            accept="image/jpg, image/jpeg, image/png , image/bmp"
                            className="upload-input"
                            onChange={handleQuestionInputChange}
                          />
                        </div>

                        <button
                          type="button"
                          className="btn btn-info btn-block"
                          name="uploadbutton"
                        >
                          بارگذاری
                        </button>
                      </div>
                      <div className="center m-2 p-2 col-12 d-flex  flex-column justify-content-around align-items-center rounded shadow ">
                        <div className="title">
                          <h5>تصویر پاسخ</h5>
                        </div>

                        <div className="dropzone fa-4x">
                          {imageUrlAnswer && (
                            <img
                              src={imageUrlAnswer}
                              alt=""
                              className="w-50 h-100"
                            />
                          )}
                          <input
                            type="file"
                            className="upload-input"
                            onChange={handleAnswerInputChange}
                          />
                        </div>

                        <button
                          type="button"
                          className="btn btn-info btn-block"
                          name="uploadbutton"
                        >
                          بارگذاری
                        </button>
                      </div>
                    </div>
                    <br></br>
                    <div className="select-container d-flex flex-wrap justify-content-between">
                      <label className="mt-2" forhtml="coorectAnswer">
                        پاسخ صحیح:
                      </label>
                      <Select
                        options={correctAnswerOptions}
                        placeholder="پاسخ صحیح"
                        name="corectAnswer"
                        value={selectedCorrectAnswerOption}
                        className="basic-multi-select pt-3 text-right col-12"
                        classNamePrefix="select"
                        onChange={handleChangeCorrectAnswer}
                      />
                      <label className="mt-2" forhtml="bases">
                        پایه های تحصیلی:
                      </label>
                      <Select
                        options={baseOptions}
                        placeholder="پایه های تحصیلی"
                        name="bases"
                        value={selectedBaseOption}
                        className="basic-multi-select pt-3 text-right col-12"
                        classNamePrefix="select"
                        onChange={handleChangeBase}
                      />
                      <label className="mt-2" forhtml="fields">
                        رشته تحصیلی:
                      </label>
                      <Select
                        options={fieldOptions}
                        placeholder="رشته تحصیلی"
                        isMulti
                        name="fields"
                        value={selectedFieldOption}
                        className="basic-multi-select pt-3 text-right col-12"
                        classNamePrefix="select"
                        onChange={handleChangeField}
                      />
                      <label className="mt-2" forhtml="books">
                        نام کتاب:
                      </label>
                      <Select
                        options={bookOptions}
                        placeholder="نام کتاب"
                        value={selectedBookOption}
                        name="books"
                        className="basic-multi-select pt-3 text-right col-12 "
                        classNamePrefix="select"
                        onChange={handleChangeBook}
                      />
                      <label className="mt-2" forhtml="subjects">
                        مبحث:
                      </label>
                      <Select
                        options={subjectOptions}
                        placeholder="مبحث"
                        value={selectedSubjectOption}
                        name="subjects"
                        className="basic-multi-select pt-3 text-right col-12"
                        classNamePrefix="select"
                        onChange={handleChangeSubject}
                      />
                      <label className="mt-2" forhtml="lessons">
                        درس:
                      </label>
                      <Select
                        options={lessonOptions}
                        placeholder="درس"
                        isMulti
                        name="lessons"
                        value={selectedLessonOption}
                        className="basic-multi-select pt-3 text-right col-12"
                        classNamePrefix="select"
                        onChange={handleChangeLesson}
                      />
                      <label className="mt-2" forhtml="levels">
                        سطح سوال:
                      </label>
                      <Select
                        options={levelOptions}
                        placeholder="سطح سوال"
                        name="levels"
                        value={selectedLevelOption}
                        className="basic-multi-select pt-3 mb-5 text-right col-12"
                        classNamePrefix="select"
                        onChange={handleChangeLevel}
                      />
                      <button
                        className="btn btn-outline-warning col-2 m-auto"
                        type="submit"
                        disabled={butLoading ? true : false}
                      >
                        {butLoading ? <BeatLoader color="yellow" loading={butLoading} size={8} css={butOverride} /> : <span>ویرایش<i className="fas fa-plus mr-2"></i></span>}
                      </button>

                      <br></br>
                    </div>
                    <h3
                      className={`${errorShow ? "d-block" : "d-none"
                        } mt-3 text-center text-danger`}
                    >
                      لطفا تمام موارد را انتخاب کنید
                    </h3>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  };
  return useLoading();
};

export default EditQuestions;
