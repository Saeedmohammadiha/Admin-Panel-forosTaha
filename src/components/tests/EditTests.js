import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import Select from 'react-select';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { errorsCatch } from '../login/errorsCatch';
import { baseUrl } from '../../baseUrl';
import '../../css/fileInput.css';
import BeatLoader from 'react-spinners/BeatLoader';
import { css } from '@emotion/react';
import { override } from '../../css/override';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import transition from 'react-element-popper/animations/transition';
import opacity from 'react-element-popper/animations/opacity';
const EditTests = () => {
  const navigate = useNavigate()
  const params = useParams();
  const [id, setId] = useState(params.id);
  let [loading, setLoading] = useState(true);
  const [baseOptions, setBaseOptions] = useState([]);
  const [fieldOptions, setFieldOptions] = useState([]);
  const [duration, setDuration] = useState();
  const [name, setName] = useState();
  const [capacity, setCapacity] = useState();
  const [date, setDate] = useState();
  const [description, setDescription] = useState();
  const [selectedKindOption, setSelectedKindOption] = useState();
  const [selectedstepOption, setSelectedstepOption] = useState();
  const [selectedHasDateOption, setSelectedHasDateOption] = useState({
    value: 0,
  });
  const [selectedUsersOption, setSelectedUsersOption] = useState();
  const [selectedBaseOption, setSelectedBaseOption] = useState();
  const [selectedFieldOption, setSelectedFieldOption] = useState();
  const [inputQuestionValue, setInputQuestionValue] = useState();
  const [selectedQuestionOption, setSelectedquestionOption] = useState();
  const [questionOption, setQuestionOption] = useState();
  const [stepOptions, setStepOptions] = useState();
  const [errorShow, setErrorShow] = useState(false);
  const [butLoading, setButLoading] = useState(false);

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

  const kindOptions = [
    { value: 1, label: '????????' },
    { value: 2, label: '???? ??????' },
  ];
  const haseDateOptions = [
    { value: 1, label: '??????????' },
    { value: 2, label: '????????' },
  ];
  const usersOptions = [
    { value: 1, label: '???????????? ' },
    { value: 2, label: '??????????????' },
  ];

  /**
   * getting the options of the selects from server
   *
   */
  useEffect(() => {
    baseUrl
      .get('/api/v1/tests/create')
      .then((response) => {
        const base = response.data.data.base;
        const baseOption = base?.map((baseitem) => {
          return { value: baseitem.id, label: baseitem.name };
        });
        setBaseOptions(baseOption);
        const steps = response.data.data.steps?.map((step) => {
          return { value: step.id, label: step.title };
        });
        setStepOptions(steps);

        const field = response.data.data.field;
        const fieldOption = field?.map((fielditem) => {
          return { value: fielditem.id, label: fielditem.name };
        });
        setFieldOptions(fieldOption);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.status === 401) {
          localStorage.clear()
          navigate('/')
        }
        if (err.response.status === 403) {
          navigate('/FourOThree') ;
        }
      });
  }, []);

  useEffect(() => {
    baseUrl
      .get(`/api/v1/tests/${id}/edit`)
      .then((response) => {
        const data = response.data.data.data;
        console.log(response);
        setSelectedBaseOption({ value: data.base.id, label: data.base.name });
        setSelectedFieldOption({
          value: data.field.id,
          label: data.field.name,
        });
        setSelectedUsersOption({
          value: data.users,
          label: data.users == 1 ? '???????????? ????????' : '????????????',
        });
        setSelectedHasDateOption({
          value: data.date,
          label: data.date == 1 ? '??????????' : '????????',
        });
        setSelectedKindOption({
          value: data.type,
          label: data.type == 1 ? '????????' : '???? ??????',
        });

        setSelectedstepOption({ value: data.step.id, label: data.step.title });
        setCapacity(data.capacity);
        setDescription(data.description);
        setDuration(data.time);
        setName(data.name);
        setDate(data.date_value);
        const selectedQustions = data.questions.map((question) => {
          return { value: question.id, label: `???????? ?????????? ${question.id}` };
        });
        setSelectedquestionOption(selectedQustions);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status == 401) {
          window.location.href = '/';
        }
        if (err.response.status == 403) {
          window.location.href = '/FourOThree';
        }
      });
  }, []);
  /**
   * saving the selected option in state
   *
   * @param {event object selected option} selectedBookOption
   */

  const handleChangeBase = (selectedBaseOption) => {
    setSelectedBaseOption(selectedBaseOption);
  };
  const handleChangeField = (selectedFieldOption) => {
    setSelectedFieldOption(selectedFieldOption);
  };
  const handleChangeDuration = (e) => {
    setDuration(e.target.value);
  };
  const handleChangeName = (e) => {
    setName(e.target.value);
  };
  const handleChangeCapacity = (e) => {
    setCapacity(e.target.value);
  };
  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };
  const handleChangeKind = (selectedKindOption) => {
    setSelectedKindOption(selectedKindOption);
  };
  const handleChangeHaseDate = (selectedHaseDateOption) => {
    setSelectedHasDateOption(selectedHaseDateOption);
  };
  const handleChangeUsers = (selectedUsersOption) => {
    setSelectedUsersOption(selectedUsersOption);
  };
  const handleChangestep = (selectedstepOption) => {
    setSelectedstepOption(selectedstepOption);
  };
  const handleChangeDate = (date) => {
    setDate(`${date.year}/${date.month.number}/${date.day}`);
  };
  const handleChangeQuestion = (selectedQuestionOption) => {
    setSelectedquestionOption(selectedQuestionOption);
  };
  const handleChangeInputQuestion = (inputQuestionValue) => {
    baseUrl
      .post(`/api/v1/tests/search-question`, { id: inputQuestionValue })
      .then((response) => {
        const data = response.data.data.data;
        const items = data.map((item) => {
          return { value: item.id, label: `???????? ?????????? ${item.id}` };
        });
        setQuestionOption(items);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * posting the values to server
   *
   * @param {event obj} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setButLoading(true);
    const questionIds = selectedQuestionOption?.map((option) => {
      return option.value;
    });
    if (
      (selectedBaseOption &&
        selectedFieldOption &&
        name &&
        capacity &&
        duration &&
        selectedUsersOption &&
        selectedKindOption &&
        selectedHasDateOption.value == 1) ||
      (selectedBaseOption &&
        selectedFieldOption &&
        name &&
        capacity &&
        duration &&
        selectedUsersOption &&
        selectedKindOption &&
        date)
    ) {
      setErrorShow(false);
      setLoading(true);
      baseUrl
        .put(`/api/v1/tests/${id}`, {
          name: name,
          description: description,
          step_id: selectedUsersOption.value===2 ? '' : selectedstepOption.value,
          type: selectedKindOption.value,
          users: selectedUsersOption.value,
          time: duration,
          date: selectedHasDateOption.value,
          date_value: date,
          field_id: selectedFieldOption.value,
          base_id: selectedBaseOption.value,
          capacity: capacity,
          questions_id: questionIds,
        })
        .then((response) => {
          withReactContent(Swal)
            .fire({
              confirmButtonText: '????????',
              title: '???????????? ???? ',
              icon: 'success',
            })
            .then((response) => {
              setTimeout((window.location.pathname = '/tests'), 1000);
            });
        })
        .catch((err) => {
          errorsCatch(err.response.data);
          setLoading(false);
          setButLoading(false);
        });
    } else {
      setErrorShow(true);
      setButLoading(false);
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
              <h5 className="text-center mb-2">???????????? ??????????</h5>
              <div className="col-12 h-100 p-4 light rounded shadow bg-light">
                <div className="form-container">
                  <form onSubmit={handleSubmit}>
                    <div className="select-container d-flex flex-wrap justify-content-between">
                      <label className="mt-2" forhtml="coorectAnswer">
                        ?????? ??????????:
                      </label>
                      <input
                        placeholder="?????? ??????????"
                        className="form-control "
                        value={name}
                        onChange={handleChangeName}
                      />
                      <label className="mt-2" forhtml="coorectAnswer">
                        ???????? ??????????:
                      </label>
                      <input
                        placeholder="???????? ?????????? (?????????? ??????????)"
                        className="form-control"
                        value={duration}
                        onChange={handleChangeDuration}
                      />
                      <label className="mt-2" forhtml="coorectAnswer">
                        ??????????:
                      </label>
                      <input
                        placeholder="?????????? (?????????? ??????)"
                        className="form-control"
                        value={capacity}
                        onChange={handleChangeCapacity}
                      />
                      <label className="mt-2" forhtml="bases">
                        ???????? ?????? ????????????:
                      </label>
                      <Select
                        options={baseOptions}
                        placeholder="???????? ?????? ????????????"
                        name="bases"
                        value={selectedBaseOption}
                        className="basic-multi-select pt-3 text-right col-12"
                        classNamePrefix="select"
                        onChange={handleChangeBase}
                      />
                      <label className="mt-2" forhtml="fields">
                        ???????? ????????????:
                      </label>
                      <Select
                        options={fieldOptions}
                        placeholder="???????? ????????????"
                        name="fields"
                        value={selectedFieldOption}
                        className="basic-multi-select pt-3 text-right col-12"
                        classNamePrefix="select"
                        onChange={handleChangeField}
                      />
                      <label className="mt-2" forhtml="fields">
                        ?????? ??????????:
                      </label>
                      <Select
                        options={kindOptions}
                        placeholder="?????? ??????????"
                        name="kinds"
                        value={selectedKindOption}
                        className="basic-multi-select pt-3 text-right col-12"
                        classNamePrefix="select"
                        onChange={handleChangeKind}
                      />
                      <label className="mt-2" forhtml="fields">
                        ??????????:
                      </label>
                      <Select
                        options={haseDateOptions}
                        placeholder=" ?????????? ??????????"
                        name="haseDate"
                        value={selectedHasDateOption}
                        className="basic-multi-select pt-3 text-right col-12"
                        classNamePrefix="select"
                        onChange={handleChangeHaseDate}
                      />
                      <div
                        className={`col-12 ${
                          selectedHasDateOption.value == 2
                            ? 'd-block'
                            : 'd-none'
                        } mt-3`}
                      >
                        <DatePicker
                          value={date}
                          onChange={handleChangeDate}
                          inputClass="form-control "
                          calendar={persian}
                          locale={persian_fa}
                          placeholder="??????????"
                          animations={[
                            opacity(),
                            transition({
                              from: 40,
                              transition:
                                'all 400ms cubic-bezier(0.335, 0.010, 0.030, 1.360)',
                            }),
                          ]}
                        />
                      </div>

                      <label className="mt-2" forhtml="fields">
                        ???????? ??????????????:
                      </label>
                      <Select
                        options={usersOptions}
                        placeholder=" ??????????????"
                        name="users"
                        value={selectedUsersOption}
                        className="basic-multi-select pt-3 text-right col-12"
                        classNamePrefix="select"
                        onChange={handleChangeUsers}
                      />
                      <div
                        className={
                          selectedUsersOption?.value === 1
                            ? 'w-100 text-right'
                            : 'd-none'
                        }
                      >
                        <label className="mt-2" forhtml="fields">
                          ??????:
                        </label>
                        <Select
                          options={stepOptions}
                          placeholder=" ??????"
                          name="step"
                          value={selectedstepOption}
                          className="basic-multi-select pt-3 text-right col-12"
                          classNamePrefix="select"
                          onChange={handleChangestep}
                        />
                      </div>
                      <label className="mt-2" forhtml="fields">
                        ??????????????:
                      </label>
                      <textarea
                        className="form-control m-auto mt-3 mb-3"
                        value={description}
                        onChange={handleChangeDescription}
                      ></textarea>
                      <Select
                        options={questionOption}
                        isMulti
                        inputValue={inputQuestionValue}
                        onInputChange={handleChangeInputQuestion}
                        placeholder="????????????"
                        name="questions"
                        value={selectedQuestionOption}
                        className="basic-multi-select mb-5 pt-3 text-right col-12"
                        classNamePrefix="select"
                        onChange={handleChangeQuestion}
                      />

                      <button
                        className="btn btn-outline-warning col-2 m-auto"
                        type="submit"
                        disabled={butLoading ? true : false}
                      >
                        {butLoading ? (
                          <BeatLoader
                            color="yellow"
                            loading={butLoading}
                            size={8}
                            css={butOverride}
                          />
                        ) : (
                          <span>
                            ????????????<i className="fas fa-plus mr-2"></i>
                          </span>
                        )}
                      </button>
                      <br></br>
                    </div>
                    <h3
                      className={`${
                        errorShow ? 'd-block' : 'd-none'
                      } mt-3 text-center text-danger`}
                    >
                      ???????? ???????? ?????????? ???? ???????????? ????????
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

export default EditTests;
