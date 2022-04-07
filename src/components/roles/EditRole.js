import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { override } from "../../css/override";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Select from "react-select";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { baseUrl } from "../../baseUrl";
import { errorsCatch } from "../login/errorsCatch";

const EditRole = () => {
    const params = useParams();
    const [inputText, setInputText] = useState();
    const [label, setLabel] = useState("");
    const [id, setId] = useState(params.id);
    let [loading, setLoading] = useState(true);
    const [permissionOption, setPermissionOption] = useState()
    const [selectedOption, setSelectedOption] = useState();
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
    /**
     * seting the input state to the value of the item that user wants to edit
     *
     */
    useEffect(() => {
        baseUrl
            .get(`/api/v1/role/${id}/edit`)
            .then((response) => {
                console.log(response);
                setInputText(response.data.data.data.name);
                setLabel(response.data.data.data.label)
                const permissions = response.data.data.data.permission.map((permission)=>{
                    return {value: permission.id , label : permission.name}
                })
                setSelectedOption(permissions)
                setLoading(false);
            })
            .catch((err) => {
                console.log(err.response);
                if (err.response.status == 401) {
                    window.location.href = '/'
                }
                if (err.response.status == 403) {
                    window.location.href = '/FourOThree'
                }
            });
    }, []);
    /**
     * getting the selected items
     *
     */
    useEffect(() => {
        baseUrl
            .get("/api/v1/role/create")
            .then((response) => {
                const options = response.data.data.data.map((option) => {
                    return { value: option.id, label: option.name };
                });
                setPermissionOption(options);
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status == 401) {
                    window.location.href = '/'
                }
                if (err.response.status == 403) {
                    window.location.href = '/FourOThree'
                }
            });
    }, []);

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

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
                title: "لطفا نام را وارد کنید",
                icon: "error",
            }).then(() => {
                setButLoading(false)
            })
        } else {
            const permissions = selectedOption.map((permission) => {
                return permission.value
            })
            baseUrl
                .put(`/api/v1/role/${id}`, {
                    name: inputText,
                    permission_id: permissions,
                    label: label
                })
                .then((response) => {
                    MySwal.fire({
                        confirmButtonText: "باشه",
                        title: "ویرایش شد ",
                        icon: "success",
                    }).then((response) => {
                        setTimeout((window.location.pathname = "/role"), 1000);
                    });
                })
                .catch((err) => {
                    errorsCatch(err.response.data);
                    setButLoading(false)
                });
        }
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
                            <div className="col-12 h-75 p-4 light rounded shadow bg-light">
                                <h2 className="text-center mb-3">ویرایش نقش</h2>
                                <form
                                    className="d-flex flex-column align-items-center"
                                    onSubmit={handleSubmit}
                                >
                                    <input
                                        autoFocus
                                        className="form-control w-50 m-auto mt-4"
                                        type="text"
                                        placeholder="مبحث"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                    />
                                    <br></br>
                                    <input
                                        
                                        className="form-control w-50 m-auto"
                                        type="text"
                                        placeholder="برچسب"
                                        value={label}
                                        onChange={(e) => setLabel(e.target.value)}
                                    />
                                    <Select
                                        options={permissionOption}
                                        placeholder="دسترسی "
                                        isMulti
                                        value={selectedOption}
                                        onChange={handleChange}
                                        name="permission"
                                        className="basic-multi-select pt-3 text-right w-50 m-auto"
                                        classNamePrefix="select"
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

export default EditRole;
