import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { css } from '@emotion/react';
import { errorsCatch } from '../login/errorsCatch';
import { override } from '../../css/override';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import SearchInput from './SearchInput';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import BeatLoader from 'react-spinners/BeatLoader';
import { baseUrl } from '../../baseUrl';


const Volume = () => {
  const navigate = useNavigate()
  let [loading, setLoading] = useState(true);
  let [tableLoading, settableLoading] = useState(false);
  const [items, setItems] = useState('');
  const [totalPage, setTotalPage] = useState('');
  const [curentPage, setCurentPage] = useState('1');
  const [search, setSearch] = useState('');
  const [searchItem, setSearchItem] = useState('');
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
   * handles the search form by sending a get request to api with query string that is the word that users wants to search
   *
   * @param {event obj} e
   */
  const handleSearch = (e) => {
    setSearchItem(search);
    e.preventDefault();
    baseUrl
      .get(
        `/api/v1/volume?page=${curentPage}&search=${search}`
      )
      .then((response) => {
      })
      .catch((err) => {
      });
  };

  useEffect(() => {
    baseUrl
      .get(
        `/api/v1/volume?page=${curentPage}&search=${search}`
      )
      .then((response) => {
        const data = response.data.data.data.data;
        setTotalPage(response.data.data.data.total);
        settableLoading(false);
        const myTable = data?.map((row) => {
          return (
            <tr key={row.id}>
              <td>
                {row.name}
              </td>
              <td className="text-left">
                <button
                  id={row.id}
                  className="btn btn btn-outline-danger m-1 my-2 my-sm-0"
                  onClick={handleDelete}
                >
                  ??????
                </button>
                <Link
                  id={row.id}
                  to={`/volume/edit/${row.id}`}
                  className="btn btn btn-outline-warning m-1 my-2 my-sm-0"
                >
                  ????????????
                </Link>
              </td>
            </tr>
          );
        });
        setItems(myTable);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          localStorage.clear()
          navigate('/')
        }
        if (err.response.status === 403) {
          navigate( '/FourOThree');
        }
      });
  }, [
    searchItem,
    curentPage,
  ]);

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
   * this function handles the deleting of items
   *
   * @param {{}} e
   */

  const handleDelete = (e) => {
    const id = e.target.id;
    const MySwal = withReactContent(Swal);
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: '?????? ?????????? ????????????',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '???????? ?????? ????',
        cancelButtonText: '???? ',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          baseUrl
            .delete(`/api/v1/volume/${id}`)
            .then((response) => {
              settableLoading(true);
              MySwal.fire({
                confirmButtonText: '????????',
                title: '!?????? ???? ',
                text: '?????????? ?????????????? ?????? ?????? ???? ',
                icon: 'success',
              }).then((response) => {
                navigate('/volume') ;
              });
            })
            .catch((err) => {
              errorsCatch(err.response.data);
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          MySwal.fire({
            title: '???????? ????',
            confirmButtonText: '????????',
            icon: 'error',
          });
        }
      });
  };
  
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
              <div className="col-12  p-4 light rounded shadow bg-light">
                <h2 className="text-center mb-3"> ???????? ???? </h2>
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
                    to={'/volume/add'}
                    className="btn btn-outline-success  my-2 my-sm-0"
                    type="button"
                  >
                    ????????????
                    <i className="fas fa-plus mr-2"></i>
                  </Link>
                </nav>

                <div className=" m-auto">
                  <table className="table table-hover rounded shadow text-right mt-5">
                    <tbody>
                      <tr>
                        <th scope="row">  ?????? ???????? </th>
                        <th scope="row" className="text-left pl-5">
                          ??????????????
                        </th>
                      </tr>
                      {tableLoading ? (
                        <tr>
                          <td colSpan="2">
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
          </div>
        </>
      );
    }
  };

  return <>{useLoading()}</>;
};

export default Volume;
