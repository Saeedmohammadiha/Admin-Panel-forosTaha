import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
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

const Questions = () => {
  const navigate = useNavigate()
  let [loading, setLoading] = useState(true);
  let [tableLoading, settableLoading] = useState(false);
  const [items, setItems] = useState("");
  const [search, setSearch] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [curentPage, setCurentPage] = useState("1");
  const [totalPage, setTotalPage] = useState("");
  const [searchType, setSearchType] = useState();
  const [searchTypeValue, setSearchTypeValue] = useState("1");

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
      .get(`/api/v1/questions?page=${curentPage}&search=${search}`)
      .then((response) => {
        const data = response.data.data.data.data;
        setTotalPage(response.data.data.data.total);
        setLoading(false);
        settableLoading(false);

        const modalLessonItems = data[0].lesson?.map((lessonitem) => {
          return <tr>{lessonitem.name}</tr>;
        });
        const modalFieldItems = data[0].field?.map((fielditem) => {
          return <tr>{fielditem.name}</tr>;
        });

        const items = data?.map((item) => {
          const trueOp = (x) => {
            switch (x) {
              case 'option_a':
                return 'A'
                break;
              case 'option_b':
                return 'B'
                break;
              case 'option_c':
                return 'C'
                break;
              case 'option_d':
                return 'D'
                break;
            }
          }
          return (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.subject.name}</td>
              <td>{item.base.name}</td>
              <td>{item.level.name}</td>
              <td>{trueOp(item.true_option)}</td>
              <td className="text-left">
                <button
                  id={item.id}
                  type="button"
                  data-toggle="modal"
                  data-target={`#${item.id}Modal`}
                  className="btn btn btn-outline-info m-1 my-2 my-sm-0"
                >
                  جزئیات
                </button>

                <div
                  className="modal fade"
                  id={`${item.id}Modal`}
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby={`${item.id}Modallabel`}
                  aria-hidden="true"
                >
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5
                          className="modal-title "
                          id={`${item.id}Modallabel`}
                        >
                          جزئیات
                        </h5>
                        <button
                          type="button"
                          className="close ml-0"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <table className="table  table-hover rounded shadow text-right ">
                          <tr>
                            <th>درس</th>
                            <th>رشته</th>
                          </tr>
                          <tr>
                            <td>{modalLessonItems}</td>
                            <td>{modalFieldItems}</td>
                          </tr>
                        </table>
                        <p className="text-right text-dark">عکس سوال:</p>
                        <img
                          className="h-100 w-100"
                          src={`https://panel.farostaha.net${item.question}`}
                          alt=''
                        />
                        <p className="text-right text-dark">عکس جواب:</p>
                        <img
                          className="h-100 w-100"
                          src={`https://panel.farostaha.net${item.answer}`}
                          alt=''
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  id={item.id}
                  className="btn btn btn-outline-danger m-1 my-2 my-sm-0"
                  onClick={handleDelete}
                >
                  حذف
                </button>
                <Link
                  id={item.id}
                  to={`/questions/edit/${item.id}`}
                  className="btn btn btn-outline-warning m-1 my-2 my-sm-0"
                >
                  ویرایش
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
  }, [curentPage, searchItem]);
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
    { value: 1, label: "ردیف" },
    { value: 2, label: "پایه" },
    { value: 3, label: "رشته" },
    { value: 4, label: "سطح" },
    { value: 5, label: "درس" },
    { value: 6, label: "کتاب" },
    { value: 7, label: "مبحث" },
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
   * handles the search form by sending a get request to api with query string that is the word that users wants to search
   *
   * @param {event obj} e
   */
  const handleSearch = (e) => {
    setSearchItem(search);
    e.preventDefault();
    baseUrl
      .get(
        `/api/v1/questions?page=${curentPage}&search=${search}&type=${searchTypeValue}`
      )
      .then((response) => { })
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
        title: "آیا مطمئن هستید؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "آره، پاک کن",
        cancelButtonText: "نه ",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          baseUrl
            .delete(`/api/v1/questions/${id}`)
            .then((response) => {
              settableLoading(true);
              MySwal.fire({
                confirmButtonText: "باشه",
                title: "!پاک شد ",
                text: "گزینه انتخابی شما پاک شد ",
                icon: "success",
              }).then((response) => {
                navigate("/questions") ;
              });
            })
            .catch((err) => {
              errorsCatch(err.response.data);
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          MySwal.fire({
            title: "کنسل شد",
            confirmButtonText: "باشه",
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
                    جست و جو
                  </button>
                  <Select
                    options={searchOptions}
                    placeholder="بر اساس"
                    value={searchType}
                    onChange={handeleTypeChange}
                    name="books"
                    className="basic-multi-select pt-3  text-right col-8"
                    classNamePrefix="select"
                  />
                </form>
                <Link
                  to={"/questions/add"}
                  className="btn btn-outline-success  my-2 my-sm-0"
                  type="button"
                >
                  افزودن
                  <i className="fas fa-plus mr-2"></i>
                </Link>
              </nav>

              <div className=" m-auto">
                <h2 className="text-center mt-3"> سوالات</h2>

                <table className="table  table-hover rounded shadow text-right ">
                  <tbody>
                    <tr>
                      <th scope="row"> ردیف </th>
                      <th scope="row" className="">
                        مبحث
                      </th>
                      <th scope="row" className="">
                        پایه
                      </th>
                      <th scope="row" className="">
                        سطح
                      </th>
                      <th scope="row" className="">
                        گزینه صحیح
                      </th>
                      <th scope="row" className="text-left pl-5">
                        تغییرات
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
                  nextLabel="بعدی >"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={2}
                  pageCount={Math.ceil(totalPage / 20)}
                  previousLabel="< قبلی"
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

export default Questions;
