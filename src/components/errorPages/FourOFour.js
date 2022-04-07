import React from "react";
import { Link } from "react-router-dom";

const FourOFour = () => {
  return (
    <div className="">
      <div className="w-50 bg-light m-auto text-center mt-5 p-5 rounded shadow">
        <h1 className="tittle">404</h1>
        <h2 className="pt-2">صفحه مورد نظر یافت نشد!</h2>
        <h6 className=" p-3">
          احتمالا صفحه مورد نظر شما حذف یا تغییر نام داده شده است.
              </h6>
              <Link to={'/'} className="btn btn-dark" >بازگشت به صفحه اصلی</Link>
      </div>
    </div>
  );
};

export default FourOFour;
