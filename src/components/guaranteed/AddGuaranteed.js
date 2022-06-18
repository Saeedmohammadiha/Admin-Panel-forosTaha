import React, { useEffect, useState } from 'react';
import { override } from '../../css/override';
import BeatLoader from 'react-spinners/BeatLoader';
import { css } from '@emotion/react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { baseUrl } from '../../baseUrl';
import { errorsCatch } from '../login/errorsCatch';
import '../../css/fileInput.css';
import { useNavigate } from 'react-router';

const AddGuaranteed = () => {
  const navigate = useNavigate()
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [butLoading, setButLoading] = useState(false);
  const [description, setDescription] = useState();
  const butOverride = css`
    display: block;
    text-align: center;
  `;
  /*
   * controling the collapse and toggle in sidebar
   */
  const [collapse, setCollapse] = useState(false);
  const [toggled, setToggled] = useState(false);

  const handleToggleSidebar = (value) => {
    setToggled(value);
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
   * displaying the image that user selects
   *
   */
  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  /**
   * function that submits the form and sends the value that users wants to add to api
   *
   * @param {event obj} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setButLoading(true);
    if ((inputText, selectedImage)) {
      const formData = new FormData();
      formData.append('link', inputText);
      formData.append('description', description);
      formData.append('image', selectedImage);
      baseUrl
        .post('/api/v1/guaranteed', formData)
        .then((response) => {
          const MySwal = withReactContent(Swal);
          MySwal.fire({
            confirmButtonText: 'باشه',
            title: 'اضافه شد ',
            icon: 'success',
          }).then((response) => {
            setLoading(true);
            setButLoading(false);
            setTimeout(() => {
              navigate('/guaranteed');
            }, 2000);
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
              <div className="col-12  p-4 light rounded shadow bg-light">
                <h2 className="text-center mb-3">افزودن صوت</h2>
                <form
                  className="d-flex flex-column align-items-center"
                  onSubmit={handleSubmit}
                >
                  <input
                    autoFocus
                    className="form-control w-75 mt-4 mb-4"
                    type="text"
                    placeholder="لینک "
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />

                  <div className="article-image-container">
                    <div className="dropzone">
                      {imageUrl && selectedImage && (
                        <img
                          src={imageUrl}
                          alt={selectedImage.name}
                          className="h-100 w-50"
                        />
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
                  <textarea
                    placeholder="توضیحات"
                    className="form-control w-75  mb-4"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />

                  <br></br>
                  <br></br>

                  <button
                    className="btn btn-outline-success w-25 "
                    type="submit"
                    disabled={butLoading ? true : false}
                  >
                    {butLoading ? (
                      <BeatLoader
                        color="green"
                        loading={butLoading}
                        size={8}
                        css={butOverride}
                      />
                    ) : (
                      <span>
                        افزودن<i className="fas fa-plus mr-2"></i>
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

export default AddGuaranteed;
