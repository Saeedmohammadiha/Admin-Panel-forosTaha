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

const AddAdmin = () => {
    const navigate = useNavigate()

    const [inputText, setInputText] = useState("");
    const [family, setFamily] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
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
                if (err.response.status === 401) {
                    localStorage.clear()
                    navigate('/')
                  }
                  if (err.response.status === 403) {
                    navigate('/FourOThree') ;
                  }
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
     * function that submits the form and sends the value that users wants to add to api
     *
     * @param {event obj} e
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        setButLoading(true)
        if (!inputText || !selectedOption) {
            Swal.fire({
                confirmButtonText: "باشه",
                title: "لطفا  موارد را وارد کنید",
                icon: "error",
            }).then(() => {
                setButLoading(false)
            })
        } else {

            const roles = selectedOption.map((role) => {
                return role.value
            })
            baseUrl
                .post("/api/v1/admin", { name: inputText, family: family, password: password, email: email, phone: phone, role_id: roles })
                .then((response) => {
                    const MySwal = withReactContent(Swal);
                    MySwal.fire({
                        confirmButtonText: "باشه",
                        title: "اضافه شد ",
                        icon: "success",
                    }).then((response) => {
                        setLoading(true);
                        setTimeout(navigate("/admin") , 2000);
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
                                <h2 className="text-center mb-3">افزودن ادمین</h2>
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
                                        className="btn btn-outline-success w-25 "
                                        type="submit"
                                        disabled={butLoading ? true : false}
                                    >
                                        {butLoading ? <BeatLoader color="green" loading={butLoading} size={8} css={butOverride} /> : <span>افزودن<i className="fas fa-plus mr-2"></i></span>}

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

export default AddAdmin;
