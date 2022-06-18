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
import { useNavigate } from 'react-router';

const Pay = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const [butLoading, setButLoading] = useState(false);
  const [values, setValues] = useState([{ id: '' , amount: '', description: '' }, { id: '' , amount: '', description: '' }]);
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
      .get(`/api/v1/get-pay`)
      .then((response) => {
        console.log(response.data.data);
        const data = response.data.data.data
        console.log(data);
        const newValues = data?.map((item)=>{
          return { id: item.id , amount: item.amount, description: item.description }
        })
        setValues(newValues)
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

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...values];
    list[index][name] = value;
    setValues(list);
  };
  /**
   * editing the item with put request
   *
   * @param {event obj} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(values);
    setButLoading(true);
    if (values) {
      const formData = new FormData();
      formData.append('data',JSON.stringify(values));
      formData.append('_method', 'PUT');
      baseUrl
        .post(`/api/v1/update-pay`, formData)
        .then((response) => {
          const MySwal = withReactContent(Swal);
          MySwal.fire({
            confirmButtonText: 'باشه',
            title: 'ویرایش شد ',
            icon: 'success',
          }).then((response) => {
            setTimeout(() => {
              navigate('/dashboard') ;
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
          <div className="d-flex"  style={{height: '100vh'}}>
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
                <h2 className="text-center mb-3">اشتراک ها</h2>
                <form
                  className="d-flex flex-column align-items-center pt-5"
                  onSubmit={handleSubmit}
                >
                  {values?.map((value, index) => {
                    return (
                      <>

                        <div className="d-flex w-50" key={index}>
                          <div className='text-center ml-3 pt-2 tex-bolder' >{index+1 }:</div>
                          <input
                            name="amount"
                            className="form-control mb-3  text-wrap text-break"
                            placeholder="قیمت"
                            value={value.amount}
                            onChange={(e) => handleChange(e, index)}
                          />
                          <input
                            name="description"
                            className="form-control  mb-3 mr-5 text-wrap text-break"
                            placeholder="توضیحات"
                            value={value.description}
                            onChange={(e) => handleChange(e, index)}
                          />
                        </div>
                       
                      </>
                    );
                  })}

                  <br></br>

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

export default Pay;
