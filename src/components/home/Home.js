import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "react-pro-sidebar/dist/css/styles.css";
import Sidebar from "../Sidebar";
const Home = () => {
  /**
   * controling the collapse and toggle in sidebar
   */
  const [collapse, setCollapse] = useState(false);
  const [toggled, setToggled] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const handleToggleSidebar = (value) => {
    setToggled(value);
  };
useEffect(()=>{
  if (!user) {
    navigate('/')
  }
},[])

 
  
      return (
        <div className="d-flex ">
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
              <h1 className="text-center h-100 display-1 m-5" >داشبورد</h1>
            </div>
          </div>
        </div>
      );
    

};

export default Home;
