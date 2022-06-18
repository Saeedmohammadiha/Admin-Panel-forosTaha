import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { css } from "@emotion/react";
import { errorsCatch } from "../login/errorsCatch";
import { override } from "../../css/override";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import SearchInput from "./SearchInput";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import BeatLoader from "react-spinners/BeatLoader";
import { baseUrl } from "../../baseUrl";
import Switch from "react-switch";

const School = () => {
    const navigate = useNavigate()
    let [loading, setLoading] = useState(true);
    let [tableLoading, settableLoading] = useState(false);
    const [items, setItems] = useState("");
    const [totalPage, setTotalPage] = useState("");
    const [curentPage, setCurentPage] = useState("1");
    const [toggle, setToggle] = useState();
    const [search, setSearch] = useState("");
    const [searchItem, setSearchItem] = useState("");
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
                `/api/v1/school?page=${curentPage}&search=${search}`
            )
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        baseUrl.get(`/api/v1/school?page=${curentPage}&search=${search}`).then((response) => {
            const data = response.data.data.data.data
            console.log(data);
            setTotalPage(response.data.data.data.total);
            settableLoading(false);
            const myTable = data?.map((row) => {
                // const myDate = new Date(arguments);
                return (
                    <tr key={row.id}>
                        <td >{row.title}</td>
                        <td >{row.manager_name} {row.manager_family}</td>
                        <td >{row.section}</td>
                        <td >{row.manager_phone}</td>
                        
                        <td >
                            <Switch
                                id={row.id}
                                onChange={() => {
                                    const condition = row.status === 1 ? 0 : 1;
                                    baseUrl
                                        .put("/school/active-manager-or-deactivate", {
                                            phone: row.manager_phone,
                                            status: condition,
                                        })
                                        .then((response) => {
                                            setToggle(!toggle);

                                            withReactContent(Swal).fire({
                                                confirmButtonText: "باشه",
                                                title: "",
                                                text: "وضعیت مقاله تغییر پیدا کرد",
                                                icon: "success",
                                            });
                                        })
                                        .catch((err) => {
                                            errorsCatch(err.response.data);
                                        });
                                }}
                                checked={row.status === 1 ? true : false}
                            />
                        </td>
                        
                        <td  className="text-left">
                         
                            <Link
                                id={row.id}
                                to={`/school/edit/${row.id}`}
                                className="btn btn btn-outline-warning m-1 my-2 my-sm-0"
                            >
                                ویرایش
                            </Link>
                        </td>
                    </tr>
                )
            })
            setItems(myTable)
            setLoading(false)
        }).catch((err) => {
            if (err.response.status === 401) {
                localStorage.clear()
                navigator('/')
            }
            if (err.response.status === 403) {
                navigator('/FourOThree') 
            }
        })
    }, [searchItem, curentPage, toggle])

    

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
                                <h2 className="text-center mb-3"> مدارس  </h2>
                                <nav className="navbar rounded shadow navbar-light bg-light">
                                    <form className="form-inline" onSubmit={handleSearch}>
                                        <SearchInput
                                            setSearch={setSearch}
                                        />
                                        <button
                                            className="btn btn-outline-success my-2 my-sm-0"
                                            type="submit"
                                        >
                                            جست و جو
                                        </button>
                                    </form>
                                    
                                    <Link
                                        to={"/school/add"}
                                        className="btn btn-outline-success  my-2 my-sm-0"
                                        type="button"
                                    >
                                        افزودن
                                        <i className="fas fa-plus mr-2"></i>
                                    </Link>
                                </nav>

                                <div className=" m-auto">
                                    <table className="table table-hover rounded shadow text-right mt-5">
                                        <tbody>
                                            <tr>
                                                <th scope="row"> نام مدرسه  </th>
                                                <th scope="row"> نام و نام خانوادگی مدیر </th>
                                                <th scope="row"> مقطع تحصیلی </th>
                                                <th scope="row">  شماره همراه </th>
                                                <th scope="row"> وضعیت </th>
                                                <th scope="row" className="text-left pl-5">
                                                    تغییرات
                                                </th>
                                            </tr>
                                            {tableLoading ? (
                                                <tr>
                                                    <td colSpan="7">
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
                    </div>
                </>
            );
        }
    };

    return <>{useLoading()}</>;
}

export default School