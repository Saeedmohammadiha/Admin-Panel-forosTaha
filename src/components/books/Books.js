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

const Books = () => {
  const navigate = useNavigate()

  let [loading, setLoading] = useState(true);
  let [tableLoading, settableLoading] = useState(false);
  const [items, setItems] = useState("");
  const [search, setSearch] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [curentPage, setCurentPage] = useState("1");
  const [totalPage, setTotalPage] = useState("");

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
      .get(`/api/v1/books?page=${curentPage}&search=${search}`)
      .then((response) => {
        const data = response.data.data.data.data;

        setTotalPage(response.data.data.data.total);
        setLoading(false);
        settableLoading(false);
        const items = data.map((item) => {
          return (
            <tr key={item.id}>
              <td>{item.name}</td>
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
                  to={`/Books/edit/${item.id}`}
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

  /**
   * handles the search form by sending a get request to api with query string that is the word that users wants to search
   *
   * @param {event obj} e
   */
  const handleSearch = (e) => {
    setSearchItem(search);
    e.preventDefault();
    baseUrl
      .get(`/api/v1/books?page=${curentPage}&search=${search}`)
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
            .delete(`/api/v1/books/${id}`)
            .then((response) => {
              settableLoading(true);
              MySwal.fire({
                confirmButtonText: "????????",
                title: "!?????? ???? ",
                text: "?????????? ?????????????? ?????? ?????? ???? ",
                icon: "success",
              }).then((response) => {
                navigate("/books")
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
                </form>
                <Link
                  to={"/books/add"}
                  className="btn btn-outline-success  my-2 my-sm-0"
                  type="button"
                >
                  ????????????
                  <i className="fas fa-plus mr-2"></i>
                </Link>
              </nav>

              <div className=" m-auto">
                <h2 className="text-center mt-3">???????? ????</h2>
                <table className="table  table-hover rounded shadow text-right ">
                  <tbody>
                    <tr>
                      <th scope="row"> ?????? </th>
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

export default Books;
