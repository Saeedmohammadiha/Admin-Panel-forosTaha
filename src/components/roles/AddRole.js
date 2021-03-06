import React, { useState, useEffect } from "react";
import { override } from "../../css/override";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'
import { baseUrl } from "../../baseUrl";
import { errorsCatch } from "../login/errorsCatch";
import Select from "react-select";
import { useNavigate } from "react-router";

const AddRole = () => {
    const navigate = useNavigate()
    const [inputText, setInputText] = useState("");
    const [label, setLabel] = useState("");
    const [loading, setLoading] = useState(false);
    const [butLoading, setButLoading] = useState(false)
    const [permissionOption, setPermissionOption] = useState()
    const [selectedOption, setSelectedOption] = useState();

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
     * geting the options of the select book element from api and setting to state
     *
     */

    useEffect(() => {
        baseUrl
            .get("/api/v1/role/create")
            .then((response) => {
                const options = response.data.data.data?.map((option) => {
                    return { value: option.id, label: option.name };
                });
                setPermissionOption(options);
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
    }, []);


    /**
  * selecting the item of the select permission element and store it in state
  *
  * @param {selected item that is stord in state} selectedOption
  */
    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };
    /**
     * function that submits the form and sends the value that users wants to add to api
     *
     * @param {event obj} e
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        setButLoading(true)
        if (!inputText) {
            Swal.fire({
                confirmButtonText: "????????",
                title: "???????? ?????? ???????? ???? ???????? ????????",
                icon: "error",
            }).then(() => {
                setButLoading(false)
            })
        } else {
            const permissions = selectedOption?.map((permission) => {
                return permission.value
            })
            baseUrl
                .post("/api/v1/role", { name: inputText, permission_id: permissions, label: label })
                .then((response) => {
                    const MySwal = withReactContent(Swal);
                    MySwal.fire({
                        confirmButtonText: "????????",
                        title: "?????????? ???? ",
                        icon: "success",
                    }).then((response) => {
                        setLoading(true);
                        setTimeout(navigate("/role"), 2000);
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
                                <h2 className="text-center mb-3">???????????? ??????</h2>
                                <form
                                    className="d-flex flex-column align-items-center"
                                    onSubmit={handleSubmit}
                                >
                                    <input
                                        autoFocus
                                        className="form-control w-50 m-auto"
                                        type="text"
                                        placeholder="??????"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                    />
                                    <br></br>
                                    <input
                                        
                                        className="form-control w-50 m-auto"
                                        type="text"
                                        placeholder="??????????"
                                        value={label}
                                        onChange={(e) => setLabel(e.target.value)}
                                    />
                                    <Select
                                        options={permissionOption}
                                        placeholder="???????????? ????"
                                        isMulti
                                        value={selectedOption}
                                        onChange={handleChange}
                                        name="permissions"
                                        className="basic-multi-select pt-3 text-right w-50 m-auto"
                                        classNamePrefix="select"
                                    />
                                    <br></br>
                                    <br></br>

                                    <button
                                        className="btn btn-outline-success w-25 "
                                        type="submit"
                                        disabled={butLoading ? true : false}
                                    >
                                        {butLoading ? <BeatLoader color="green" loading={butLoading} size={8} css={butOverride} /> : <span>????????????<i className="fas fa-plus mr-2"></i></span>}

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

export default AddRole;
