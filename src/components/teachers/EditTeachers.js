import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { override } from '../../css/override';
import { css } from '@emotion/react';
import BeatLoader from 'react-spinners/BeatLoader';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { baseUrl } from '../../baseUrl';
import { errorsCatch } from '../login/errorsCatch';
import MyEditor from '../../MyEditor';

const EditTeachers = () => {
  const navigate = useNavigate()
  const params = useParams();
  const [id, setId] = useState(params.id);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
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

  
  /**
   * seting the input state to the value of the item that user wants to edit
   *
   */
  useEffect(() => {
    baseUrl
      .get(`/api/v1/teacher/${id}/edit`)
      .then((response) => {
        const data = response.data.data.data;
        setInputText(data.name);
        setEditor(data.content);
        setImageUrl(`https://panel.farostaha.net${data.image}`);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          localStorage.clear()
          navigate('/')
        }
        if (err.response.status === 403) {
          navigate('/FourOThree') ;
        }
      });
  }, [id]);

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
    if (inputText && editor) {
      const formData = new FormData();
      formData.append('name', inputText);
      formData.append('content', editor);
      formData.append('image', selectedImage);
      formData.append('_method', 'PUT');
      baseUrl
        .post(`/api/v1/teacher/${id}`, formData)
        .then((response) => {
          const MySwal = withReactContent(Swal);
          MySwal.fire({
            confirmButtonText: 'باشه',
            title: 'ویرایش شد ',
            icon: 'success',
          }).then((response) => {
            setTimeout(
              navigate('/teachers') 
            , 1000);
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
                <h2 className="text-center mb-3">ویرایش استاد</h2>
                <form
                  className="d-flex flex-column align-items-center"
                  onSubmit={handleSubmit}
                >
                  <input
                    autoFocus
                    className="form-control w-75  mt-4 mb-4"
                    type="text"
                    placeholder="نام و نام خانوادگی"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />

                  <div className="article-image-container">
                    <div className="dropzone ">
                      {imageUrl && (
                        <img src={imageUrl} alt="teacher" className="h-100 w-50" />
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
                      بارگذاری عکس استاد
                    </button>
                  </div>
                  <div className="w-100 h-100 wrap mt-5">
                    <MyEditor
                      handleChange={(data) => {
                        setEditor(data);
                      }}
                      data={editor}
                      API_URL="/api/v1/teacher/upload-image"
                    />
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

export default EditTeachers;
