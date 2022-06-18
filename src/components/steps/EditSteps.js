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

const EditSteps = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [id, setId] = useState(params.id);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [butLoading, setButLoading] = useState(false);
  const [videos, setVideos] = useState([{ description: '', link: '' }]);
  const [pdfs, setPdfs] = useState([{ description: '', link: '' }]);
  const [selectedStepsOption, setSelectedStepsOption] = useState([
    { value: 0, label: '0' },
  ]);
  const butOverride = css`
    display: block;
    text-align: center;
  `;

  const stepsOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 10, label: '10' },
    { value: 11, label: '11' },
    { value: 12, label: '12' },
    { value: 13, label: '13' },
    { value: 14, label: '14' },
    { value: 15, label: '15' },
    { value: 16, label: '16' },
    { value: 17, label: '17' },
    { value: 18, label: '18' },
    { value: 19, label: '19' },
    { value: 20, label: '20' },
    { value: 21, label: '21' },
    { value: 22, label: '22' },
    { value: 23, label: '23' },
    { value: 24, label: '24' },
  ];
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
      .get(`/api/v1/steps/${id}/edit`)
      .then((response) => {
        const data = response.data.data.data;
        setInputText(data.title);
        setSelectedStepsOption({ value: data.number, label: data.number });
        if (data.brochure_link.length) {
          setPdfs(
            data.brochure_link.map((b) => {
              return { description: b.description, link: b.link };
            })
          );
        }
        if (data.video_link.length) {
          setVideos(
            data.video_link.map((b) => {
              return { description: b.description, link: b.link };
            })
          );
        }

        setImageUrl(`https://panel.farostaha.net${data.image}`);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status == 401) {
          localStorage.clear()
          navigate('/')
        }
        if (err.response.status == 403) {
          navigate('/FourOThree')
        }
      });
  }, []);

  /**
   * displaying the image that user selects
   *
   */
  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  /**
   * editing the item with put request
   *
   * @param {event obj} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setButLoading(true);
    if (inputText) {
      const formData = new FormData();
      formData.append('title', inputText);
      formData.append(
        'number',
        selectedStepsOption.value ? selectedStepsOption.value : 0
      );
      formData.append('image', selectedImage);
      formData.append('video_link', JSON.stringify(videos));
      formData.append('brochure_link', JSON.stringify(pdfs));
      formData.append("_method", "PUT");

      baseUrl
        .post(`/api/v1/steps/${id}`, formData)
        .then((response) => {
          const MySwal = withReactContent(Swal);
          MySwal.fire({
            confirmButtonText: 'باشه',
            title: 'ویرایش شد ',
            icon: 'success',
          }).then((response) => {
            setTimeout(navigate('/steps'), 2000);
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
  /**
   * saving the image that user selects inside state
   *
   * @param {event obj} e
   */
  const handleInputChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  // handle click event of the Add button
  const handleAddClickVideos = () => {
    setVideos([...videos, { description: '', link: '' }]);
  };

  // handle click event of the Remove button
  const handleRemoveClickVideos = (index) => {
    const list = [...videos];
    list.splice(index, 1);
    setVideos(list);
  };

  // handle input change
  const handleChangeVideos = (e, index) => {
    const { name, value } = e.target;
    const list = [...videos];
    list[index][name] = value;
    setVideos(list);
  };

  // handle click event of the Add button
  const handleAddClickPdfs = () => {
    setPdfs([...pdfs, { description: '', link: '' }]);
  };

  // handle click event of the Remove button
  const handleRemoveClickPdfs = (index) => {
    const list = [...pdfs];
    list.splice(index, 1);
    setPdfs(list);
  };

  // handle input change
  const handleChangePdfs = (e, index) => {
    const { name, value } = e.target;
    const list = [...pdfs];
    list[index][name] = value;
    setPdfs(list);
  };
  const handleChangeSteps = (selectedStepsOption) => {
    setSelectedStepsOption(selectedStepsOption);
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
                    className="form-control w-75 mt-4 mb-4"
                    type="text"
                    placeholder="عنوان"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />

                  <Select
                    options={stepsOptions}
                    name="rate"
                    className="basic-multi-select mb-3 pt-3 text-right w-75 "
                    placeholder="گام"
                    classNamePrefix="select"
                    value={selectedStepsOption}
                    onChange={handleChangeSteps}
                  />

                  <div className="article-image-container">
                    <div className="dropzone">
                      {imageUrl && (
                        <img src={imageUrl} className="h-100 w-50" alt='' />
                      )}

                      <input
                        type="file"
                        accept="image/jpg, image/jpeg, image/png , image/bmp"
                        className="upload-input-article"
                        onChange={handleInputChange}
                      />
                    </div>

                    <button
                      type="button"
                      className="btn btn-info btn-block"
                      name="uploadbutton"
                    >
                      بارگذاری عکس
                    </button>
                  </div>

                  <br></br>
                  <br></br>
                  <div className="text-right w-100">
                    <div className="tittle m-auto">ویدیو</div>
                    {videos?.map((video, index) => {
                      return (
                        <div className="col-12 m-auto" key={index}>
                          <div className="d-flex">
                            <input
                              name="description"
                              className="form-control w-50 mb-3 text-wrap text-break"
                              placeholder="توضیحات"
                              value={video.description}
                              onChange={(e) => handleChangeVideos(e, index)}
                            />
                            <input
                              name="link"
                              className="form-control w-50 mb-3 text-wrap text-break"
                              placeholder="لینک"
                              value={video.link}
                              onChange={(e) => handleChangeVideos(e, index)}
                            />
                            {videos.length !== 1 && (
                              <button
                                type="button"
                                className=" btn btn-danger mb-3"
                                onClick={() => handleRemoveClickVideos(index)}
                              >
                                حذف
                              </button>
                            )}
                          </div>
                          {videos.length - 1 === index && (
                            <button
                              type="button"
                              className=" btn btn-primary mb-3"
                              onClick={handleAddClickVideos}
                            >
                              اضافه کردن
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-right w-100 mt-5">
                    <div className="tittle m-auto">پی دی اف</div>
                    {pdfs?.map((pdf, index) => {
                      return (
                        <div className="col-12 m-auto" key={index}>
                          <div className="d-flex">
                            <input
                              name="description"
                              className="form-control w-50 mb-3 text-wrap text-break"
                              placeholder="توضیحات"
                              value={pdf.description}
                              onChange={(e) => handleChangePdfs(e, index)}
                            />
                            <input
                              name="link"
                              className="form-control w-50 mb-3 text-wrap text-break"
                              placeholder="لینک"
                              value={pdf.link}
                              onChange={(e) => handleChangePdfs(e, index)}
                            />
                            {pdfs.length !== 1 && (
                              <button
                                type="button"
                                className=" btn btn-danger mb-3"
                                onClick={() => handleRemoveClickPdfs(index)}
                              >
                                حذف
                              </button>
                            )}
                          </div>
                          {pdfs.length - 1 === index && (
                            <button
                              type="button"
                              className=" btn btn-primary mb-3"
                              onClick={handleAddClickPdfs}
                            >
                              اضافه کردن
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
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

export default EditSteps;
