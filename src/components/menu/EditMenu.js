import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { override } from "../../css/override";
import Select from "react-select";

import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { baseUrl } from "../../baseUrl";
import { errorsCatch } from "../login/errorsCatch";

const EditMenu = () => {
    const navigate = useNavigate()
    const params = useParams();
    const [inputText, setInputText] = useState();
    const [id, setId] = useState(params.id);
    let [loading, setLoading] = useState(true);
    const [parentOptions, setParentOptions] = useState([])
    const [selectedParentOption, setSelectedParentOption] = useState()
    const [viewOptions, setViewOptions] = useState([])
    const [selectedViewOption, setSelectedViewOption] = useState()
    const [butLoading, setButLoading] = useState(false)

    const butOverride = css`
    display: block;
    text-align: center;
    `;
    /**
     * controling the collapse and toggle in sidebar
     */
    const [collapse, setCollapse] = useState(false);
    const [toggled, setToggled] = useState(false);

    const handleToggleSidebar = (value) => {
        setToggled(value);
    };

    useEffect(() => {
        baseUrl
            .get("/api/v1/menu/create").then((response) => {
                const options = [{ value: '0', label: 'بدون والد' }]
                const parents = response.data.data.data?.map((parent) => {
                    return { value: parent.id, label: parent.name }
                })
                const parentoptions = options.concat(parents)
                setParentOptions(parentoptions)
                const view = response.data.data.view?.map((v) => {
                    return { value: v, label: v }
                })
                setViewOptions(view)
            }).catch((err) => {
                if (err.response.status === 401) {
                    localStorage.clear()
                    navigate('/')
                }
                if (err.response.status === 403) {
                    navigate('/FourOThree') 
                }
            })

    }, [])
    /**
     * seting the input state to the value of the item that user wants to edit
     *
     */
    useEffect(() => {
        baseUrl
            .get(`/api/v1/menu/${id}/edit`)
            .then((response) => {
                setInputText(response.data.data.data.name);
                if (response.data.data.data.parent_id === 0) {
                    setSelectedParentOption({ value: '0', label: 'بدون والد' })

                } else {
                    setSelectedParentOption({ value: response.data.data.data.parent_id, label: response.data.data.data.parent.name })

                }
                switch (response.data.data.data.view) {
                    case 'tazmini':
                        setSelectedViewOption({ value: 'tazmini', label: 'tazmini' })
                        break;
                    case 'category':
                        setSelectedViewOption({ value: 'category', label: 'category' })
                        break;
                    case 'service':
                        setSelectedViewOption({ value: 'service', label: 'service' })
                        break;

                    default:
                        break;
                }
                setLoading(false);

            })
            .catch((err) => {
                if (err.response.status === 401) {
                    navigate('/')
                }
                if (err.response.status === 403) {
                    navigate('/FourOThree') 
                }
            });
    }, []);


    /**
     * editing the item with put request
     *
     * @param {event obj} e
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        setButLoading(true)
        const MySwal = withReactContent(Swal);
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        if (!inputText) {
            MySwal.fire({
                confirmButtonText: "باشه",
                title: "لطفا نام جدید را وارد کنید",
                icon: "error",
            }).then(() => {
                setButLoading(false)
            })
        } else {
            baseUrl
                .put(`/api/v1/menu/${id}`, { name: inputText, parent_id: `${selectedParentOption ? selectedParentOption.value : ''}`, view: `${selectedViewOption ? selectedViewOption.value : ''}` })
                .then((response) => {
                    MySwal.fire({
                        confirmButtonText: "باشه",
                        title: "ویرایش شد ",
                        icon: "success",
                    }).then((response) => {
                        setTimeout(navigate("/menu"), 2000);
                    });
                })
                .catch((err) => {
                    errorsCatch(err.response.data);
                    setButLoading(false)
                });
        }
    };


    const handleChangeParent = (selectedParentOption) => {
        setSelectedParentOption(selectedParentOption);
    };
    const handleChangeView = (selectedViewOption) => {
        setSelectedViewOption(selectedViewOption);
    };


    /**
     * this is a conditional rendering function that is going to show or doesn't the loading icon
     *
     * @returns the loading icon or the page
     */
    const useLoading = () => {
        if (loading) {
            return (
                <BeatLoader color="gray" loading={loading} size={30} css={override} />
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
                            <div className="col-12 h-75 p-4 light rounded shadow bg-light">
                                <h2 className="text-center mb-3">ویرایش پایه تحصیلی</h2>
                                <form
                                    className="d-flex flex-column align-items-center"
                                    onSubmit={handleSubmit}
                                >
                                    <input
                                        autoFocus
                                        className="form-control col-6 m-auto mt-4"
                                        type="text"
                                        placeholder="نام"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                    />
                                    <Select
                                        options={parentOptions}
                                        placeholder="والد"
                                        name="parent"
                                        value={selectedParentOption}
                                        className="basic-multi-select pt-3 text-right col-6"
                                        classNamePrefix="select"
                                        onChange={handleChangeParent}
                                    />
                                    <Select
                                        options={viewOptions}
                                        placeholder="ویو"
                                        name="view"
                                        value={selectedViewOption}
                                        className="basic-multi-select pt-3 text-right col-6"
                                        classNamePrefix="select"
                                        onChange={handleChangeView}
                                    />
                                    <br></br>
                                    <br></br>
                                    <button
                                        className="btn btn-outline-warning col-2 m-auto"
                                        type="submit"
                                        disabled={butLoading ? true : false}
                                    >
                                        {butLoading ? <BeatLoader color="yellow" loading={butLoading} size={8} css={butOverride} /> : <span>ویرایش<i className="fas fa-plus mr-2"></i></span>}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            );
        }
    };

    return <>{useLoading()}</>;
};

export default EditMenu;
