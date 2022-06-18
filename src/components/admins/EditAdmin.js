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

const EditAdmin = () => {
    const navigate = useNavigate()

    const params = useParams();
    const [inputText, setInputText] = useState();
    const [family, setFamily] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [id, setId] = useState(params.id);
    let [loading, setLoading] = useState(true);
    const [butLoading, setButLoading] = useState(false)
    const [roleOption, setRoleOption] = useState()
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
     * seting the input state to the value of the item that user wants to edit
     *
     */
    useEffect(() => {
        baseUrl
            .get(`/api/v1/admin/${id}/edit`)
            .then((response) => {
                const data = response.data.data.data
                if (data.role.length) {
                    const roles = data.role.map((rol) => {
                        return { value: rol.id, label: rol.name }
                    })
                    setSelectedOption(roles)
                }
                setInputText(data.name);
                setFamily(data.family)
                setPhone(data.phone)
                setEmail(data.email)
                setLoading(false);
            })
            .catch((err) => {
                console.log(err.response);
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
         * geting the options of the select book element from api and setting to state
         *
         */

    useEffect(() => {
        baseUrl
            .get("/api/v1/admin/create")
            .then((response) => {
                console.log(response);
                const options = response.data.data.role.map((option) => {
                    return { value: option.id, label: option.name };
                });
                setRoleOption(options);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);


    /**
 * selecting the item of the select role element and store it in state
 *
 * @param {selected item that is stord in state} selectedOption
 */
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
        if (!inputText || !selectedOption) {
            MySwal.fire({
                confirmButtonText: "باشه",
                title: "لطفا موارد را وارد کنید",
                icon: "error",
            }).then(() => {
                setButLoading(false)
            })
        } else {
            const roles = selectedOption.map((role) => {
                return role.value
            })
            baseUrl
                .put(`/api/v1/admin/${id}`, { name: inputText, family: family, password: password, email: email, phone: phone, role_id: roles })
                .then((response) => {
                    MySwal.fire({
                        confirmButtonText: "باشه",
                        title: "ویرایش شد ",
                        icon: "success",
                    }).then((response) => {
                        setTimeout(navigate("/admin"), 1000);
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
                                <h2 className="text-center mb-3">ویرایش  ادمین</h2>
                                <form
                                    className="d-flex flex-column align-items-center"
                                    onSubmit={handleSubmit}
                                >
                                    <input
                                        
                                        className="form-control w-50 m-auto"
                                        type="text"
                                        placeholder="نام"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                    />
                                    <br></br>
                                    <input
                                        
                                        className="form-control w-50 m-auto"
                                        type="text"
                                        placeholder="نام خانوادگی"
                                        value={family}
                                        onChange={(e) => setFamily(e.target.value)}
                                    />
                                    <br></br>
                                    <input
                                        
                                        className="form-control w-50 m-auto"
                                        type="text"
                                        placeholder="شماره همراه"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                    <br></br>
                                    <input
                                        
                                        className="form-control w-50 m-auto"
                                        type="text"
                                        placeholder="ایمیل"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <br></br>
                                    <input
                                        className="form-control w-50 m-auto"
                                        type="text"
                                        placeholder="پسورد"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <Select
                                        options={roleOption}
                                        placeholder="نقش ها"
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

export default EditAdmin;
