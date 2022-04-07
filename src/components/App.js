import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./home/Home";
import Bases from "./bases/Bases";
import AddBases from "./bases/AddBases";
import EditBases from "./bases/EditBases";
import Books from "./books/Books";
import AddBooks from "./books/AddBooks";
import EditBooks from "./books/EditBooks";
import Fields from "./fields/Fields";
import AddFields from "./fields/AddFields";
import EditFields from "./fields/EditFields";
import Levels from "./levels/Levels";
import AddLevels from "./levels/AddLevels";
import EditLevels from "./levels/EditLevels";
import Subjects from "./subjects/Subjects";
import AddSubjects from "./subjects/AddSubjects";
import EditSubjects from "./subjects/EditSubjects";
import Lessons from "./lessons/Lessons";
import AddLessons from "./lessons/AddLessons";
import EditLessons from "./lessons/EditLessons";
import AddQuestions from "./questions/AddQuestions";
import Login from "./login/Login";
import Questions from "./questions/Questions";
import EditQuestions from './questions/EditQuestions'
import AddTests from "./tests/AddTests";
import Tests from "./tests/Tests";
import EditTests from "./tests/EditTests";
import FourOFour from "./errorPages/FourOFour";
import Menu from "./menu/Menu";
import AddMenu from "./menu/AddMenu";
import EditMenu from "./menu/EditMenu";
import Category from "./category/Category";
import AddCategory from "./category/AddCategory";
import EditCategory from "./category/EditCategory";
import Tag from "./tag/Tag";
import AddTag from "./tag/AddTag";
import EditTag from "./tag/EditTag";
import EditArticles from "./articles/EditArticles";
import Articles from "./articles/Articles";
import AddArticles from "./articles/AddArticles";
import FourOThree from "./errorPages/FourOThree";
import Permission from "./permissions/Permission";
import AddPermission from "./permissions/AddPermission";
import EditPermission from "./permissions/EditPermission";
import Role from "./roles/Role";
import AddRole from "./roles/AddRole";
import EditRole from "./roles/EditRole";
import Admin from "./admins/Admin";
import AddAdmin from "./admins/AddAdmin";
import EditAdmin from "./admins/EditAdmin";
const App = () => {
  
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route exact path="/dashboard" element={<Home />} />
      <Route exact path="/bases" element={<Bases />} />
      <Route exact path="/bases/add" element={<AddBases />} />
      <Route exact path="/bases/edit/:id" element={<EditBases />} />
      <Route exact path="/books" element={<Books />} />
      <Route exact path="/books/add" element={<AddBooks />} />
      <Route exact path="/books/edit/:id" element={<EditBooks />} />
      <Route exact path="/fields" element={<Fields />} />
      <Route exact path="/fields/add" element={<AddFields />} />
      <Route exact path="/fields/edit/:id" element={<EditFields />} />
      <Route exact path="/levels" element={<Levels />} />
      <Route exact path="/levels/add" element={<AddLevels />} />
      <Route exact path="/levels/edit/:id" element={<EditLevels />} />
      <Route exact path="/subjects" element={<Subjects />} />
      <Route exact path="/subjects/add" element={<AddSubjects />} />
      <Route exact path="/subjects/edit/:id" element={<EditSubjects />} />
      <Route exact path="/lessons" element={<Lessons />} />
      <Route exact path="/lessons/add" element={<AddLessons />} />
      <Route exact path="/lessons/edit/:id" element={<EditLessons />} />
      <Route exact path="/questions/add" element={<AddQuestions />} />
      <Route exact path="/questions/edit/:id" element={<EditQuestions />} />
      <Route exact path="/questions" element={<Questions />} />
      <Route exact path="/tests" element={<Tests />} />
      <Route exact path="/tests/add" element={<AddTests />} />
      <Route exact path="/tests/edit/:id" element={<EditTests />} />
      <Route exact path="/site/menu" element={<Menu />} />
      <Route exact path="/site/menu/add" element={<AddMenu />} />
      <Route exact path="/site/menu/edit/:id" element={<EditMenu />} />
      <Route exact path="/site/category" element={<Category />} />
      <Route exact path="/site/category/add" element={<AddCategory />} />
      <Route exact path="/site/category/edit/:id" element={<EditCategory />} />
      <Route exact path="/site/tag" element={<Tag />} />
      <Route exact path="/site/tag/add" element={<AddTag />} />
      <Route exact path="/site/tag/edit/:id" element={<EditTag />} />
      <Route exact path="/site/articles" element={<Articles />} />
      <Route exact path="/site/articles/add" element={<AddArticles />} />
      <Route exact path="/site/articles/edit/:id" element={<EditArticles />} />
      <Route exact path="/Permission" element={<Permission />} />
      <Route exact path="/Permission/add" element={<AddPermission />} />
      <Route exact path="/Permission/edit/:id" element={<EditPermission />} />
      <Route exact path="/role" element={<Role />} />
      <Route exact path="/role/add" element={<AddRole />} />
      <Route exact path="/role/edit/:id" element={<EditRole />} />
      <Route exact path="/admin" element={<Admin />} />
      <Route exact path="/admin/add" element={<AddAdmin />} />
      <Route exact path="/admin/edit/:id" element={<EditAdmin />} />
      <Route exact path="/*" element={<FourOFour />} />
      <Route exact path="/FourOThree" element={<FourOThree />} />
    </Routes>
  );
};

export default App;
