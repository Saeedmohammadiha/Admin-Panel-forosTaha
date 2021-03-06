import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { override } from "../../css/override";
import BeatLoader from "react-spinners/BeatLoader";
import { baseUrl } from "../../baseUrl";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ReactPaginate from "react-paginate";
import SearchInput from "./SearchInput";
import { errorsCatch } from "../login/errorsCatch";
import Select from "react-select";
import Switch from "react-switch";

const Tests = () => {
  let [loading, setLoading] = useState(true);
  let [tableLoading, settableLoading] = useState(false);
  const [items, setItems] = useState("");
  const [search, setSearch] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [curentPage, setCurentPage] = useState("1");
  const [totalPage, setTotalPage] = useState("");
  const [searchType, setSearchType] = useState();
  const [searchTypeValue, setSearchTypeValue] = useState("1");
  const [toggle, setToggle] = useState();
  const [typeQuizzes, setTypeQuizzes] = useState();
  const [typeQuizzesValue, setTypeQuizzesValue] = useState(null);
  const [vip, setVip] = useState();
  const [vipValue, setVipValue] = useState(null);
  const navigate = useNavigate();

  /**
   * controling the collapse and toggle in sidebar
   */
  const [collapse, setCollapse] = useState(false);
  const [toggled, setToggled] = useState(false);

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };
  /**
   * css code for loading code inside table
   *
   */
  const overrideTableLoader = css`
    display: block;
    text-align: center;
    height: 600px;
  `;

  /**
   * use Effect hook sends a request to api and mapes the response arary and sets the results in state
   *
   */
  useEffect(() => {
    baseUrl
      .get(
        `/api/v1/tests?page=${curentPage}&search=${search}&type=${searchTypeValue}&type_quizzes=${typeQuizzesValue}&type_users=${vipValue}`
      )
      .then((response) => {
        const data = response.data.data.data.data;
        setTotalPage(response.data.data.data.total);
        setLoading(false);
        settableLoading(false);

        const items = data?.map((item) => {
          return (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.field.name}</td>
              <td>{item.base.name}</td>
              <td>{item.type === 1 ? " ????????" : "???? ??????"}</td>
              <td>{item.users === 1 ? "????????????" : "??????????????"}</td>
              <td>
                <Switch
                  id={item.id}
                  onChange={() => {
                    const condition = item.status === 1 ? 0 : 1;
                    baseUrl
                      .post("/api/v1/tests/change-status", {
                        id: item.id,
                        status: condition,
                      })
                      .then((response) => {
                        setToggle(!toggle);

                        withReactContent(Swal).fire({
                          confirmButtonText: "????????",
                          title: "",
                          text: "?????????? ?????????? ?????????? ???????? ??????",
                          icon: "success",
                        });
                      })
                      .catch((err) => {
                        errorsCatch(err.response.data);
                      });
                  }}
                  checked={item.status === 1 ? true : false}
                />
              </td>

              <td className="text-left">
                <button
                  id={item.id}
                  className="btn btn btn-outline-danger m-1 my-2 my-sm-0"
                  onClick={handleDelete}
                >
                  ??????
                </button>
                <Link
                  id={item.id}
                  to={`/tests/edit/${item.id}`}
                  className="btn btn btn-outline-warning m-1 my-2 my-sm-0"
                >
                  ????????????
                </Link>
              </td>
            </tr>
          );
        });
        setItems(items);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          localStorage.clear()
          navigate('/')
        }
        if (err.response.status === 403) {
         navigate('/FourOThree') 
        }
      });
  }, [curentPage, searchItem, toggle, vipValue, typeQuizzesValue]);
  /**
   * this function handles the panination click
   *
   * @param {response from pagination click} data
   */
  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    setCurentPage(selectedPage);
    settableLoading(true);
  };

  const searchOptions = [
    { value: 1, label: "?????? ??????????" },
    { value: 2, label: "????????" },
    { value: 3, label: "????????" },
  ];
  const vipSearchOptions = [
    { value: null, label: "???????? ??????????" },
    { value: 1, label: " ????????????" },
    { value: 2, label: " ??????????????" },
  ];
  const queizTypeSearchOptions = [
    { value: null, label: "???????? ??????????" },
    { value: 1, label: "????????" },
    { value: 2, label: "???? ??????" },
  ];
  /**
   * handling the on change event on the type of the search selectbax
   *
   * @param {value of the select} searchType
   */
  const handeleTypeChange = (searchType) => {
    setSearchType(searchType);
    setSearchTypeValue(searchType.value);
  };
  /**
   * on change of select box this function gets the value ans sets it in query url and sends it to api
   *
   * @param {obj of state} typeQuizzes
   */
  const handeletypeQuizzesChange = (typeQuizzes) => {
    setTypeQuizzes(typeQuizzes);
    setTypeQuizzesValue(typeQuizzes.value);
    let searchParams = new URLSearchParams();
    if (typeQuizzes) {
      searchParams.append("type_quizzes", typeQuizzesValue);
    } else {
      searchParams.delete("type_quizzes");
    }
    navigate({ type_quizzes: searchParams.toString() });
  };
  /**
   * on change of select box this function gets the value ans sets it in query url and sends it to api
   *
   * @param {obj of state} vip
   */
  const handeletypeUsersChange = (vip) => {
    setVip(vip);
    setVipValue(vip.value);
    let searchUsersParams = new URLSearchParams();
    if (vip) {
      searchUsersParams.append("type_users", vipValue);
    } else {
      searchUsersParams.delete("type_users");
    }
    navigate({ type_users: searchUsersParams.toString() });
  };

  /**
   * handles the search form by sending a get request to api with query string that is the word that users wants to search
   *
   * @param {event obj} e
   */
  const handleSearch = (e) => {
    setSearchItem(search);
    e.preventDefault();
    baseUrl
      .get(
        `/api/v1/tests?page=${curentPage}&search=${search}&type=${searchTypeValue}&type_quizzes=${typeQuizzesValue}&type_users=${vipValue}`
      )
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * this function handles the deleting of items
   *
   * @param {event obj} e
   */

  const handleDelete = (e) => {
    const id = e.target.id;
    const MySwal = withReactContent(Swal);
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "?????? ?????????? ????????????",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "???????? ?????? ????",
        cancelButtonText: "???? ",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          baseUrl
            .delete(`/api/v1/tests/${id}`)
            .then((response) => {
              settableLoading(true);
              MySwal.fire({
                confirmButtonText: "????????",
                title: "!?????? ???? ",
                text: "?????????? ?????????????? ?????? ?????? ???? ",
                icon: "success",
              }).then((response) => {
                navigate("/tests") ;
              });
            })
            .catch((err) => {
              errorsCatch(err.response.data);
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          MySwal.fire({
            title: "???????? ????",
            confirmButtonText: "????????",
            icon: "error",
          });
        }
      });
  };
  /**
   * this is a conditional rendering function that is going to show or doesn't the loading icon
   *
   * @returns the loading icon or the page
   */
  const useLoading = () => {
    if (loading) {
      return (
        <BeatLoader color="gray" loading={loading} size={35} css={override} />
      );
    } else {
      return (
        <>
          <div className="d-flex">
            <Sidebar
              handleToggleSidebar={handleToggleSidebar}
              collapse={collapse}
              setCollapse={setCollapse}
              toggled={toggled}
              setToggled={setToggled}
            />
            <div className="w-100 p-2">
              <Navbar
                collapse={collapse}
                setCollapse={setCollapse}
                toggled={toggled}
                setToggled={setToggled}
              />
              <nav className="navbar rounded shadow navbar-light bg-light">
                <form className="form-inline" onSubmit={handleSearch}>
                  <SearchInput setSearch={setSearch} />
                  <button
                    className="btn btn-outline-success my-2 my-sm-0"
                    type="submit"
                  >
                    ?????? ?? ????
                  </button>
                  <div className="d-flex w-25 mr-5">
                    <Select
                      options={queizTypeSearchOptions}
                      placeholder="??????"
                      value={typeQuizzes}
                      onChange={handeletypeQuizzesChange}
                      name="queiztypes"
                      className="basic-multi-select col-12 text-right "
                      classNamePrefix="select"
                    />
                    <Select
                      options={vipSearchOptions}
                      placeholder="??????????"
                      value={vip}
                      onChange={handeletypeUsersChange}
                      name="typeusers"
                      className="basic-multi-select col-12  text-right "
                      classNamePrefix="select"
                    />
                  </div>
                  <Select
                    options={searchOptions}
                    placeholder="???? ????????"
                    value={searchType}
                    onChange={handeleTypeChange}
                    name=""
                    className="basic-multi-select pt-3  text-right col-8"
                    classNamePrefix="select"
                  />
                </form>

                <Link
                  to={"/tests/add"}
                  className="btn btn-outline-success  my-2 my-sm-0"
                  type="button"
                >
                  ????????????
                  <i className="fas fa-plus mr-2"></i>
                </Link>
              </nav>

              <div className=" m-auto">
                <h2 className="text-center mt-3">?????????? ????</h2>
                <table className="table  table-hover rounded shadow text-right ">
                  <tbody>
                    <tr>
                      <th scope="row"> ?????? ?????????? </th>
                      <th scope="row" className="">
                        ????????
                      </th>
                      <th scope="row" className="">
                        ????????
                      </th>
                      <th scope="row" className="">
                        ??????
                      </th>
                      <th scope="row" className="">
                        ??????????
                      </th>
                      <th scope="row" className="">
                        ????????????????
                      </th>

                      <th scope="row" className="text-left pl-5">
                        ??????????????
                      </th>
                    </tr>
                    {tableLoading ? (
                      <tr>
                        <td colspan="2">
                          <BeatLoader
                            color="gray"
                            loading={tableLoading}
                            size={10}
                            css={overrideTableLoader}
                          />
                        </td>
                      </tr>
                    ) : (
                      items
                    )}
                  </tbody>
                </table>
                <ReactPaginate
                  nextLabel="???????? >"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={2}
                  pageCount={Math.ceil(totalPage / 20)}
                  previousLabel="< ????????"
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  breakLabel="..."
                  breakClassName="page-item"
                  breakLinkClassName="page-link"
                  containerClassName="pagination justify-content-center mt-3"
                  activeClassName="active"
                  renderOnZeroPageCount={null}
                />
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  return <>{useLoading()}</>;
};

export default Tests;
