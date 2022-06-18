import React from 'react';
import { Route, Routes } from 'react-router';

import PrivateRoute from './PrivateRoute';
import Home from './home/Home';
import Bases from './bases/Bases';
import AddBases from './bases/AddBases';
import EditBases from './bases/EditBases';
import Books from './books/Books';
import AddBooks from './books/AddBooks';
import EditBooks from './books/EditBooks';
import Fields from './fields/Fields';
import AddFields from './fields/AddFields';
import EditFields from './fields/EditFields';
import Levels from './levels/Levels';
import AddLevels from './levels/AddLevels';
import EditLevels from './levels/EditLevels';
import Subjects from './subjects/Subjects';
import AddSubjects from './subjects/AddSubjects';
import EditSubjects from './subjects/EditSubjects';
import Lessons from './lessons/Lessons';
import AddLessons from './lessons/AddLessons';
import EditLessons from './lessons/EditLessons';
import AddQuestions from './questions/AddQuestions';
import Login from './login/Login';
import Questions from './questions/Questions';
import EditQuestions from './questions/EditQuestions';
import AddTests from './tests/AddTests';
import Tests from './tests/Tests';
import EditTests from './tests/EditTests';
import FourOFour from './errorPages/FourOFour';
import Menu from './menu/Menu';
import AddMenu from './menu/AddMenu';
import EditMenu from './menu/EditMenu';
import Category from './category/Category';
import AddCategory from './category/AddCategory';
import EditCategory from './category/EditCategory';
import Tag from './tag/Tag';
import AddTag from './tag/AddTag';
import EditTag from './tag/EditTag';
import EditArticles from './articles/EditArticles';
import Articles from './articles/Articles';
import AddArticles from './articles/AddArticles';
import FourOThree from './errorPages/FourOThree';
import Permission from './permissions/Permission';
import AddPermission from './permissions/AddPermission';
import EditPermission from './permissions/EditPermission';
import Role from './roles/Role';
import AddRole from './roles/AddRole';
import EditRole from './roles/EditRole';
import Admin from './admins/Admin';
import AddAdmin from './admins/AddAdmin';
import EditAdmin from './admins/EditAdmin';
import Teachers from './teachers/Teachers';
import AddTeachers from './teachers/AddTeachers';
import EditTeachers from './teachers/EditTeachers';
import Volume from './volume/Volume';
import AddVolume from './volume/AddVolume';
import EditVolume from './volume/EditVolume';
import Service from './service/Service';
import AddService from './service/AddService';
import EditService from './service/EditService';
import Guaranteed from './guaranteed/Guaranteed';
import AddGuaranteed from './guaranteed/AddGuaranteed';
import EditGuaranteed from './guaranteed/EditGuaranteed';
import AboutUs from './about us/AboutUs';
import School from './school/School';
import AddSchool from './school/AddSchool';
import EditSchool from './school/EditSchool';
import Pay from './pay/Pay';
import AddSteps from './steps/AddSteps';
import EditSteps from './steps/EditSteps';
import Steps from './steps/Steps';
import Students from './students/Students'
export default function MyRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        exact
        path="/dashboard"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/bases"
        element={
          <PrivateRoute>
            <Bases />
          </PrivateRoute>
        }
      />
      <Route
        exact
        path="/bases/add"
        element={
          <PrivateRoute>
            <AddBases />
          </PrivateRoute>
        }
      />
      <Route
        exact
        path="/bases/edit/:id"
        element={
          <PrivateRoute>
            <EditBases />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/books"
        element={
          <PrivateRoute>
            <Books />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/books/add"
        element={
          <PrivateRoute>
            <AddBooks />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/books/edit/:id"
        element={
          <PrivateRoute>
            <EditBooks />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/fields"
        element={
          <PrivateRoute>
            <Fields />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/fields/add"
        element={
          <PrivateRoute>
            <AddFields />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/fields/edit/:id"
        element={
          <PrivateRoute>
            <EditFields />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/levels"
        element={
          <PrivateRoute>
            <Levels />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/levels/add"
        element={
          <PrivateRoute>
            <AddLevels />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/levels/edit/:id"
        element={
          <PrivateRoute>
            <EditLevels />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/subjects"
        element={
          <PrivateRoute>
            <Subjects />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/subjects/add"
        element={
          <PrivateRoute>
            <AddSubjects />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/subjects/edit/:id"
        element={
          <PrivateRoute>
            <EditSubjects />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/lessons"
        element={
          <PrivateRoute>
            <Lessons />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/lessons/add"
        element={
          <PrivateRoute>
            <AddLessons />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/lessons/edit/:id"
        element={
          <PrivateRoute>
            <EditLessons />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/questions/add"
        element={
          <PrivateRoute>
            <AddQuestions />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/questions/edit/:id"
        element={
          <PrivateRoute>
            <EditQuestions />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/questions"
        element={
          <PrivateRoute>
            <Questions />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/tests"
        element={
          <PrivateRoute>
            <Tests />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/tests/add"
        element={
          <PrivateRoute>
            <AddTests />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/tests/edit/:id"
        element={
          <PrivateRoute>
            <EditTests />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/menu"
        element={
          <PrivateRoute>
            <Menu />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/menu/add"
        element={
          <PrivateRoute>
            <AddMenu />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/menu/edit/:id"
        element={
          <PrivateRoute>
            <EditMenu />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/category"
        element={
          <PrivateRoute>
            <Category />
          </PrivateRoute>
        }
      />
      <Route
        exact
        path="/category/add"
        element={
          <PrivateRoute>
            <AddCategory />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/category/edit/:id"
        element={
          <PrivateRoute>
            <EditCategory />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/tag"
        element={
          <PrivateRoute>
            <Tag />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/tag/add"
        element={
          <PrivateRoute>
            <AddTag />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/tag/edit/:id"
        element={
          <PrivateRoute>
            <EditTag />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/articles"
        element={
          <PrivateRoute>
            <Articles />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/articles/add"
        element={
          <PrivateRoute>
            <AddArticles />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/articles/edit/:id"
        element={
          <PrivateRoute>
            <EditArticles />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/teachers"
        element={
          <PrivateRoute>
            <Teachers />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/teachers/add"
        element={
          <PrivateRoute>
            <AddTeachers />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/teachers/edit/:id"
        element={
          <PrivateRoute>
            <EditTeachers />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/volume"
        element={
          <PrivateRoute>
            <Volume />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/volume/add"
        element={
          <PrivateRoute>
            <AddVolume />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/volume/edit/:id"
        element={
          <PrivateRoute>
            <EditVolume />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/service"
        element={
          <PrivateRoute>
            <Service />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/service/add"
        element={
          <PrivateRoute>
            <AddService />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/service/edit/:id"
        element={
          <PrivateRoute>
            <EditService />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/guaranteed"
        element={
          <PrivateRoute>
            <Guaranteed />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/guaranteed/add"
        element={
          <PrivateRoute>
            <AddGuaranteed />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/guaranteed/edit/:id"
        element={
          <PrivateRoute>
            <EditGuaranteed />
          </PrivateRoute>
        }
      />
      <Route
        exact
        path="/pay"
        element={
          <PrivateRoute>
            <Pay />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/about_us"
        element={
          <PrivateRoute>
            <AboutUs />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/permission"
        element={
          <PrivateRoute>
            <Permission />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/permission/add"
        element={
          <PrivateRoute>
            <AddPermission />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/permission/edit/:id"
        element={
          <PrivateRoute>
            <EditPermission />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/role"
        element={
          <PrivateRoute>
            <Role />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/role/add"
        element={
          <PrivateRoute>
            <AddRole />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/role/edit/:id"
        element={
          <PrivateRoute>
            <EditRole />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/admin"
        element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/admin/add"
        element={
          <PrivateRoute>
            <AddAdmin />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/admin/edit/:id"
        element={
          <PrivateRoute>
            <EditAdmin />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/school"
        element={
          <PrivateRoute>
            <School />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/school/add"
        element={
          <PrivateRoute>
            <AddSchool />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/school/edit/:id"
        element={
          <PrivateRoute>
            <EditSchool />
          </PrivateRoute>
        }
      />
      <Route
        exact
        path="/steps"
        element={
          <PrivateRoute>
            <Steps />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/steps/add"
        element={
          <PrivateRoute>
            <AddSteps />
          </PrivateRoute>
        }
      />

      <Route
        exact
        path="/steps/edit/:id"
        element={
          <PrivateRoute>
            <EditSteps />
          </PrivateRoute>
        }
      />
   <Route
        exact
        path="/students"
        element={
          <PrivateRoute>
            <Students />
          </PrivateRoute>
        }
      />
      <Route exact path="/*" element={<FourOFour />} />
      <Route exact path="/FourOThree" element={<FourOThree />} />
    </Routes>
  );
}
