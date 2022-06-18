import React, { useEffect, useState } from 'react';
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
import { useNavigate } from 'react-router';

const AboutUs = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState(null);
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
      .get(`/api/v1/about-us`)
      .then((response) => {
        const data = response.data.data.data;
        console.log(response);
        setEditor(data.content);
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
  }, []);


  /**
   * editing the item with put request
   *
   * @param {event obj} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setButLoading(true);
    if (editor) {
      const formData = new FormData();
      formData.append('content', editor);
      formData.append('_method', 'PUT');
      baseUrl
        .post(`/api/v1/about-us`, formData)
        .then((response) => {
          const MySwal = withReactContent(Swal);
          MySwal.fire({
            confirmButtonText: 'باشه',
            title: 'ویرایش شد ',
            icon: 'success',
          }).then((response) => {
            setTimeout(() => {
              window.location.pathname = '/dashboard';
            }, 1000);
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
        <BeatLoader color="gray" loading={loading} size={30} css={override} />
      );
    } else {
      return (
        <>
          <div className="d-flex" style={{height: '100vh'}} >
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
                <h2 className="text-center mb-3"> درباره ما</h2>
                <form
                  className="d-flex flex-column align-items-center"
                  onSubmit={handleSubmit}
                >
             
                  <div className="w-100 h-100 wrap mt-5">
                    <MyEditor
                      handleChange={(data) => {
                        setEditor(data);
                      }}
                      data={editor}
                      API_URL="/api/v1/about-us/upload-image"
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

export default AboutUs;
