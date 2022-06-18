import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { override } from '../../css/override';
import { css } from '@emotion/react';
import Select from 'react-select';
import BeatLoader from 'react-spinners/BeatLoader';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { baseUrl } from '../../baseUrl';
import { errorsCatch } from '../login/errorsCatch';

const EditSchool = () => {
  const navigate = useNavigate()
  const params = useParams();
  const [id, setId] = useState(params.id);
  const [loading, setLoading] = useState(true);
  const [butLoading, setButLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [name, setName] = useState();
  const [family, setFamily] = useState();
  const [phone, setPhone] = useState();
  const [selectedSectionOption, setSelectedSectionOption] = useState();
  const [typeOptions, setTypeOptions] = useState();
  const [selectedTypeOption, setSelectedTypeOption] = useState();

  const butOverride = css`
    display: block;
    text-align: center;
  `;

  const sectionOptions = [
    { value: 0, label: 'دهم' },
    { value: 1, label: 'یازدهم' },
    { value: 2, label: 'دوازدهم' },
  ];
  /**
   * controling the collapse and toggle in sidebar
   */
  const [collapse, setCollapse] = useState(false);
  const [toggled, setToggled] = useState(false);

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  useEffect(() => {
    baseUrl
      .get('/api/v1/school/create')
      .then((response) => {
        const data = response.data.data.data;
        let option = [];
        for (const property in data) {
          option.push({ value: property, label: data[property] });
        }
        setTypeOptions(option);
     
      })
      .catch((err) => {
        if (err.response.status === 401) {
          localStorage.clear()
          navigate('/')
        }
        if (err.response.status === 403) {
          navigate('/FourOThree') ;
        }
      });
  }, []);
  /**
   * seting the input state to the value of the item that user wants to edit
   *
   */
  useEffect(() => {
    baseUrl
      .get(`/api/v1/school/${id}/edit`)
      .then((response) => {
        const data = response.data.data.data;
        setName(data.manager_name);
        setFamily(data.manager_family);
        setPhone(data.manager_phone)
        setTitle(data.title)
        setSelectedSectionOption({label:data.section})
        if(data.type === 1 ) {
          setSelectedTypeOption({value:data.type , label: 'مدارس سمپاد'})
        } else if (data.type === 2 ) {
          setSelectedTypeOption({value:data.type , label: 'مدارس دولتی'})

        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate('/')
        }
        if (err.response.status === 403) {
          navigate('/FourOThree') ;
        }
      });
  }, [id]);

  /**
   * editing the item with put request
   *
   * @param {event obj} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setButLoading(true);
    if (
      name &&
      family &&
      phone &&
      selectedSectionOption &&
      selectedTypeOption &&
      title
    ) {
      baseUrl
        .put(`/api/v1/school/${id}`,{
          title: title,
          manager_name: name,
          manager_family: family,
          manager_phone: phone,
          type: selectedTypeOption.value,
          section: selectedSectionOption.label,
        })
        .then((response) => {
          const MySwal = withReactContent(Swal);
          MySwal.fire({
            confirmButtonText: 'باشه',
            title: 'ویرایش شد ',
            icon: 'success',
          }).then((response) => {
            setTimeout(navigate('/school') , 2000);
          });
        })
        .catch((err) => {
          errorsCatch(err.response.data);
          setButLoading(false);
        });
    } else {
      Swal.fire({
        confirmButtonText: 'باشه',
        title: 'لطفا موارد را وارد کنید',
        icon: 'error',
      }).then(() => {
        setButLoading(false);
      });
    }
  };

  const handleChangeType = (selectedTypeOption) => {
    setSelectedTypeOption(selectedTypeOption);
  };
  const handleChangeSection = (selectedSectionOption) => {
    setSelectedSectionOption(selectedSectionOption);
  };

  /**
   * this is a conditional rendering function that is going to show or doesn't the loading icon
   *
   * @returns the loading icon or the page
   */
  const useLoading = () => {
    if (loading) {
      return (
        <BeatLoader color="gray" loading={loading} size={30} css={override} />
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
              <div className="col-12  p-4 light rounded shadow bg-light">
                <h2 className="text-center mb-3">ویرایش مقاله</h2>
                <form
                  className="d-flex flex-column align-items-center"
                  onSubmit={handleSubmit}
                >
                  <input
                    autoFocus
                    className="form-control w-75 mt-4 "
                    type="text"
                    placeholder="نام مدرسه"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <input
                    autoFocus
                    className="form-control w-75 mt-4 mb-2"
                    type="text"
                    placeholder="نام مدیر"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    autoFocus
                    className="form-control w-75 mb-2 mt-4"
                    type="text"
                    placeholder="نام خانوادگی"
                    value={family}
                    onChange={(e) => setFamily(e.target.value)}
                  />
                  <input
                    className="form-control w-75  mb-2 mt-4"
                    type="number"
                    placeholder="شماره همراه"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Select
                    options={sectionOptions}
                    name="section"
                    className="basic-multi-select mb-3 pt-3 text-right w-75 "
                    placeholder="مقطع تحصیلی"
                    classNamePrefix="select"
                    value={selectedSectionOption}
                    onChange={handleChangeSection}
                  />

                  <Select
                    options={typeOptions}
                    placeholder="نوع"
                    name="type"
                    value={selectedTypeOption}
                    className="basic-multi-select pt-3 text-right w-75 "
                    classNamePrefix="select"
                    onChange={handleChangeType}
                  />

                  <br></br>
                  <br></br>
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
                        ویرایش<i className="fas fa-plus mr-2"></i>
                      </span>
                    )}
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

export default EditSchool;
