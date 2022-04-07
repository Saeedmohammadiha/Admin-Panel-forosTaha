import React from "react";
import "../css/navbar.css";

const Navbar = ({ setCollapse, collapse, toggled, setToggled }) => {
  const windowHeight = window.screen.availWidth
  return (
    <nav   className="navbar rounded shadow navbar-dark bg-dark mb-3 ">
      <div className="container-fluid  ">
        <button onClick={()=>{setCollapse(!collapse)}} type="button" id="sidebarCollapse"  className={`btn btn-info ${windowHeight<577?'d-none':''}`}>
          <i className="fas fa-align-left"></i>
        </button>
        <button onClick={()=>{setToggled(true)}} type="button"   className={`btn btn-info ${windowHeight<577?'':'d-none'}`}>
          <i className="fas fa-align-left"></i>
        </button>
        <a href="https://farostaha.com" className="btn btn-info text-white">
          صفحه اصلی سایت
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
