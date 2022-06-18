import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import 'react-pro-sidebar/dist/css/styles.css';
import Sidebar from '../Sidebar';
import { baseUrl } from '../../baseUrl';
const Home = () => {
  /**
   * controling the collapse and toggle in sidebar
   */
  const [collapse, setCollapse] = useState(false);
  const [toggled, setToggled] = useState(false);
  const navigate = useNavigate();
  const handleToggleSidebar = (value) => {
    setToggled(value);
  };
  useEffect(() => {
    baseUrl.get(`/api/v1/bases`).then((response)=>{
    }).catch((err)=>{
      if (err.response.status === 401) {
        localStorage.clear()
        navigate('/');
      }
      if (err.response.status === 403) {
        navigate('/FourOThree');
      }
    })
  }, []);

  return (
    <div className="d-flex " style={{height:'100vh'}}>
      <Sidebar
        handleToggleSidebar={handleToggleSidebar}
        collapse={collapse}
        setCollapse={setCollapse}
        toggled={toggled}
        setToggled={setToggled}
      />
      <div className="w-100 h-100 p-2">
        <Navbar
          collapse={collapse}
          setCollapse={setCollapse}
          toggled={toggled}
          setToggled={setToggled}
        />
        <div className="w-100">
          <h1 className="text-center h-100 display-1 m-5">داشبورد</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
