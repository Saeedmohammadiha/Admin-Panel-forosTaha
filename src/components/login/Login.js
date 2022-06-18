import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import BeatLoader from 'react-spinners/BeatLoader';
import { css } from '@emotion/react';
import '../../css/login.css';
import useForm from './useForm';
import { validate } from './validate';
import { Navigate } from 'react-router';

const Login = () => {
  const [loading, setLoading] = useState(false);

  /**
   * destructuring  variables , functions  from useForm
   *
   */
  const { handleChange, values, errors, handleSubmit } = useForm(
    validate,
    setLoading
  );

  const override = css`
    display: block;
    text-align: center;
  `;
  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
    
   return <Navigate to={'/dashboard'} />
   
  } else {
    return (
      <div className="wrapper shadow login-Wrapper">
        {/**
         * changing the background color using outside library
         *
         */}
        <Helmet>
          <style>{'body { background-color: #4888E7; }'}</style>
        </Helmet>
        <p className="login-tittle">
          <span className="login-span"> ورود</span> به پنل ادمین
        </p>

        <form onSubmit={handleSubmit}>
          <input
            name="phone"
            type="text"
            className="text-right login-input"
            placeholder="تلفن همراه"
            value={values.phone}
            onChange={handleChange}
          />

          <br></br>
          <p className="text-danger login-error text-right mr-5">
            {' '}
            {errors.phone}
          </p>
          <input
            type="password"
            name="password"
            className="text-right login-input"
            placeholder="پسورد"
            value={values.password}
            onChange={handleChange}
          />
          <br></br>
          <p className="text-danger login-error text-right mr-5">
            {errors.password}
          </p>
          <button
            disabled={loading ? true : false}
            className="login-button"
            id="login-button"
            type="submit"
          >
            {loading ? (
              <BeatLoader
                color="white"
                loading={loading}
                size={8}
                css={override}
              />
            ) : (
              'ورود'
            )}
          </button>
          <br></br>
        </form>
      </div>
    );
  }
};
export default Login;
