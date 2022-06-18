import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';

export default function PrivateRoute({
  children,
  component: Component,
  ...rest
}) {
  const [admin, setAdmin] = useState(null);
  React.useEffect(() => {
    const user = localStorage.getItem('user');
    setAdmin(JSON.parse(user));
  }, []);

  if (admin && admin.role === null) {
    return <Navigate to={'/'} />
  }  else {
    const user = JSON.parse(localStorage.getItem('user'));
    let permissionArray = [];
    const permissions = user?.role[0].permission;
    for (let i = 0; i < permissions?.length; i++) {
      permissionArray.push(permissions[i].name.split('-', 2)[0]);
    }
    if (permissionArray.includes(window.location.pathname.split('/', 2)[1])) {
      return children;
    } else {
      return <Navigate to={'/FourOThree'} />
    }
  }
}
