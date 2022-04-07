import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import moment from "moment-jalaali";
import Select from "react-select";

const Articles = () => {
    let [loading, setLoading] = useState(true);
    let [tableLoading, settableLoading] = useState(false);
    const [items, setItems] = useState("");
    const [totalPage, setTotalPage] = useState("");
    const [curentPage, setCurentPage] = useState("1");
    const [toggle, setToggle] = useState();
    const [mainToggle, setMainToggle] = useState();
    const [search, setSearch] = useState("");
    const [searchItem, setSearchItem] = useState("");
    const [publish, setPublish] = useState()
    const [publishValue, setPublishValue] = useState(2)
    const [firstPage, setFirstPage] = useState()
    const [firstPageValue, setFirstPageValue] = useState(2)
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



    const publishSearch = [
        { value: 2, label: "همه مقاله ها" },
        { value: 1, label: "منتشر شده" },
        { value: 0, label: "منتشر نشده" },
    ];
    const firstPageSearch = [
        { value: 2, label: "همه مقاله ها " },
        { value: 1, label: "صفحه اصلی" },

    ];



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
                `/api/v1/articles?page=${curentPage}&search=${search}&status=${publishValue}main=${firstPageValue}`
            )
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        baseUrl.get(`/api/v1/articles?page=${curentPage}&search=${search}&status=${publishValue}&main=${firstPageValue}`).then((response) => {
            const data = response.data.data.data.data
            setTotalPage(response.data.data.data.total);
            settableLoading(false);
            const myTable = data.map((row) => {
                // const myDate = new Date(arguments);
                return (
                    <tr key={row.id}>
                        <td scope="row"><a href={response.data.data.url + "/" + row.slug} >{row.title}</a></td>
                        <td scope="row">{row.admin.name} {row.admin.family}</td>
                        <td scope="row">{moment(row.created_at).format('jYYYY/jMM/jDD')}</td>
                        <td scope="row">
                            <Switch
                                id={row.id}
                                onChange={() => {
                                    const condition = row.status == 1 ? 0 : 1;
                                    baseUrl
                                        .put("/api/v1/article/change-published-article", {
                                            article_id: row.id,
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
                                checked={row.status == 1 ? true : false}
                            />
                        </td>
                        <td scope="row">
                            <Switch
                                id={row.id}
                                onChange={() => {
                                    const condition = row.main == 1 ? 0 : 1;
                                    baseUrl
                                        .put("/api/v1/article/change-main-page-article", {
                                            article_id: row.id,
                                            status: condition,
                                        })
                                        .then((response) => {
                                            setMainToggle(!mainToggle);

                                            withReactContent(Swal).fire({
                                                confirmButtonText: "باشه",
                                                title: "",
                                                text: "این مقاله به صفحه اصلی انتقال پیدا کرد",
                                                icon: "success",
                                            });
                                        })
                                        .catch((err) => {
                                            errorsCatch(err.response.data);
                                        });
                                }}
                                checked={row.main == 1 ? true : false}
                            />
                        </td>
                        <td scope="row" className="text-left">
                            <button
                                id={row.id}
                                className="btn btn btn-outline-danger m-1 my-2 my-sm-0"
                                onClick={handleDelete}
                            >
                                حذف
                            </button>
                            <Link
                                id={row.id}
                                to={`/site/articles/edit/${row.id}`}
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
            if (err.response.status == 401) {
                window.location.href = '/'
            }
            if (err.response.status == 403) {
                window.location.href = '/FourOThree'
            }
        })
    }, [searchItem, curentPage, toggle, mainToggle, publishValue, firstPageValue])

    

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
                        .delete(`/api/v1/articles/${id}`)
                        .then((response) => {
                            settableLoading(true);
                            MySwal.fire({
                                confirmButtonText: "باشه",
                                title: "!پاک شد ",
                                text: "گزینه انتخابی شما پاک شد ",
                                icon: "success",
                            }).then((response) => {
                                window.location.pathname = "/site/articles";
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
     * on change of select box this function gets the value ans sets it in query url and sends it to api
     *
     * @param {obj of state} typeQuizzes
     */
    const handelePublishChange = (publish) => {
        setPublish(publish)
        setPublishValue(publish.value)
        let searchParams = new URLSearchParams();
        if (publish) {
            searchParams.append("status", publishValue);
        } else {
            searchParams.delete("status");
        }
        navigate({ status: searchParams.toString() });
    };
    const handeleFirstPageChange = (firstPage) => {
        setFirstPage(firstPage)
        setFirstPageValue(firstPage.value)
        let searchParams = new URLSearchParams();
        if (firstPage) {
            searchParams.append("main", publishValue);
        } else {
            searchParams.delete("main");
        }
        navigate({ main: searchParams.toString() });
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
                                <h2 className="text-center mb-3"> مقالات  </h2>
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
                                    <div className="d-flex w-25 ml-5">
                                            <Select
                                                options={publishSearch}
                                                placeholder="انتشار"
                                                value={publish}
                                                onChange={handelePublishChange}
                                                name="queiztypes"
                                                className="basic-multi-select text-right w-50 "
                                                classNamePrefix="select"
                                            />
                                            <Select
                                                options={firstPageSearch}
                                                placeholder="صفحه اصلی"
                                                value={firstPage}
                                                onChange={handeleFirstPageChange}
                                                name="typeusers"
                                                className="basic-multi-select w-50 text-right "
                                                classNamePrefix="select"
                                            />
                                        </div>
                                    <Link
                                        to={"/site/articles/add"}
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
                                                <th scope="row"> نام و لینک </th>
                                                <th scope="row"> نام نویسنده </th>
                                                <th scope="row">  تاریخ انتشار  </th>
                                                <th scope="row"> انتشار </th>
                                                <th scope="row"> صفحه اصلی </th>
                                                <th scope="row" className="text-left pl-5">
                                                    تغییرات
                                                </th>
                                            </tr>
                                            {tableLoading ? (
                                                <tr scope="row">
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

export default Articles