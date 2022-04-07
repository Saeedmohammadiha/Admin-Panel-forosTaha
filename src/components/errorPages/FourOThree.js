import React from "react";
import { Link } from "react-router-dom";

const FourOThree = () => {
  return (
    <div className="">
      <div className="w-50 bg-light m-auto text-center mt-5 p-5 rounded shadow">
        <h1 className="tittle">403</h1>
        <h2 className="pt-2">صفحه مورد نظر قابل دسترسی شما نیست!</h2>
        <h6 className=" p-3">
          شما اجازه دسترسی به این بخش را ندارید.
              </h6>
              <Link to={'/dashboard'} className="btn btn-dark" >بازگشت به پنل</Link>
      </div>
    </div>
  );
};

export default FourOThree;
