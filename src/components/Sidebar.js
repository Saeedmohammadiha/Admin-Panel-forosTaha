import React from 'react';
import { Navigate, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import avatar from '../imgs/avatar.png';
import {
  ProSidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  Menu,
  MenuItem,
  SubMenu,
} from 'react-pro-sidebar';
import { baseUrl } from '../baseUrl';

const Sidebar = ({ collapse, toggled, handleToggleSidebar }) => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'));
  const delete_cookie = (name) => {
    document.cookie = name + '=' + ';expires=Thu, 01 Jan 1970 00:00:01 GMT';
  };

  if (!user) {
    return <Navigate to={'/'} />
  }
  return (
    <div className=" sticky-right">
      <ProSidebar
        onToggle={handleToggleSidebar}
        toggled={toggled}
        collapsed={collapse}
        rtl={true}
        breakPoint="sm"
      >
        <SidebarHeader>
          <div className="text-right">
            <h5 className={`p-3 ${collapse ? 'd-none' : ''}`}>
              پنل ادمین فاروس
            </h5>
            <div className="dropdown-divider"></div>
            <div className="w-50 mr-2">
              <div className="">
                <img
                  src={avatar}
                  className="rounded-circle w-100"
                  alt="UserImage"
                />
              </div>
              <div
                className={`p-3 info mt-2 text-white ${
                  collapse ? 'd-none' : ''
                }`}
              >
                <a href="/#" className="d-block">
                  {user ? user.name : null} {user ? user.family : null}
                </a>
                خوش آمدید
              </div>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Menu>
            <MenuItem icon={<i className="fas fa-home"></i>}>
              داشبورد
              <Link to="/dashboard" />
            </MenuItem>
            <MenuItem icon={<i className="fa fa-user"></i>}>
              دانش پذیران
              <Link to="/students" />
            </MenuItem>
            <SubMenu
              icon={<i className="fas fa-question-circle"></i>}
              title="سوالات"
            >
              <MenuItem icon={<i className="fas fa-university ic-list"></i>}>
                بانک سوالات
                <Link to="/questions" />
              </MenuItem>
            </SubMenu>

            <SubMenu icon={<i className="fas fa-edit"></i>} title="آزمون ها">
              <MenuItem icon={<i className="fas fa-cubes ic-list"></i>}>
                بانک آزمون ها
                <Link to="/tests" />
              </MenuItem>
              <MenuItem icon={<i className="fas fa-edit"></i>}>
                گام ها
                <Link to="/steps" />
              </MenuItem>
            </SubMenu>
            <SubMenu icon={<i className="fas fa-book"></i>} title="سایت">
              <MenuItem icon={<i className="fas fa-bolt ic-list"></i>}>
                منو اصلی
                <Link to="/menu" />
              </MenuItem>
              <MenuItem icon={<i className="fas fa-book"></i>}>
                دسته بندی
                <Link to="/category" />
              </MenuItem>
              <MenuItem icon={<i className="fas fa-hands-helping"></i>}>
                برچسب ها
                <Link to="/tag" />
              </MenuItem>
              <MenuItem icon={<i className="fas fa-table ic-list"></i>}>
                مقالات
                <Link to="/articles" />
              </MenuItem>
              <MenuItem icon={<i className="fas fa-university ic-list"></i>}>
                اساتید
                <Link to="/teachers" />
              </MenuItem>
              <MenuItem icon={<i className="fas fa-edit"></i>}>
                کتاب ها
                <Link to="/volume" />
              </MenuItem>
              <MenuItem icon={<i className="fas fa-globe ic-list"></i>}>
                سرویس ها
                <Link to="/service" />
              </MenuItem>
              <MenuItem icon={<i className="fas fa-book"></i>}>
                طرح شبه تضمینی
                <Link to="/guaranteed" />
              </MenuItem>
            </SubMenu>
            <SubMenu icon={<i className="fas fa-book"></i>} title="دسترسی ">
              <MenuItem icon={<i className="fas fa-book ic-list"></i>}>
                دسترسی ها
                <Link to="/permission" />
              </MenuItem>
              <MenuItem icon={<i className="fas fa-book ic-list"></i>}>
                نقش ها
                <Link to="/role" />
              </MenuItem>
              <MenuItem icon={<i className="fas fa-university ic-list"></i>}>
                ادمین ها
                <Link to="/admin" />
              </MenuItem>
            </SubMenu>
            <SubMenu
              icon={<i className="fas fa-cubes"></i>}
              title="دسته بندی ها"
            >
              <MenuItem icon={<i className="fas fa-book-open ic-list"></i>}>
                دروس
                <Link to="/lessons" />
              </MenuItem>
              <MenuItem icon={<i className="fas fa-tablets ic-list"></i>}>
                پایه های تحصیلی
                <Link to="/bases" />
              </MenuItem>
              <MenuItem icon={<i className="fas fa-vial ic-list"></i>}>
                رشته های تحصیلی
                <Link to="/fields" />
              </MenuItem>
              <MenuItem icon={<i className="fas fa-book ic-list"></i>}>
                کتابخانه
                <Link to="/books" />
              </MenuItem>
              <MenuItem icon={<i className="fas fa-chess ic-list"></i>}>
                مباحث
                <Link to="/subjects" />
              </MenuItem>
              <MenuItem icon={<i className="fas fa-globe ic-list"></i>}>
                سطوح
                <Link to="/levels" />
              </MenuItem>
            </SubMenu>
            <SubMenu
              icon={<i className="fas fa-university ic-list"></i>}
              title="تنظیمات"
            >
              <MenuItem icon={<i className="fas fa-globe ic-list"></i>}>
                اشتراک ها
                <Link to="/pay" />
              </MenuItem>
              <MenuItem icon={<i className="fas fa-question-circle"></i>}>
                درباره ما
                <Link to="/about_us" />
              </MenuItem>
            </SubMenu>
          </Menu>
        </SidebarContent>
        <SidebarFooter>
          <Menu>
            <MenuItem
              onClick={() => {
                baseUrl
                  .post('/api/v1/admin/logout')
                  .then((res) => {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    delete_cookie('XSRF-TOKEN');
                    delete_cookie('laravel_session');
                    navigate('/') 
                  })
                  .catch((err) => {
                    window.alert('خطای سرور');
                  });
              }}
              icon={<i className="fas fa-sign-out-alt"></i>}
            >
              خروج
            </MenuItem>
          </Menu>
        </SidebarFooter>
      </ProSidebar>
    </div>
  );
};

export default Sidebar;
