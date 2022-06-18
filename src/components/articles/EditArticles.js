import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { override } from "../../css/override";
import { css } from "@emotion/react";
import Select from "react-select";
import BeatLoader from "react-spinners/BeatLoader";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { baseUrl } from "../../baseUrl";
import { errorsCatch } from "../login/errorsCatch";
import MyEditor from "../../MyEditor";


const EditArticles = () => {
    const navigate = useNavigate()

    const params = useParams();
    const [id, setId] = useState(params.id);
    const [inputText, setInputText] = useState("");
    const [latin, setLatin] = useState()
    const [inputTextRateValue, setInputTextRateValue] = useState("");
    const [loading, setLoading] = useState(true);
    const [categoryOptions, setCategoryOptions] = useState([])
    const [selectedCategoryOption, setSelectedCategoryOption] = useState()
    const [selectedRateOption, setSelectedRateOption] = useState()
    const [tagOptions, setTagOptions] = useState([])
    const [selectedTagOption, setSelectedTagOption] = useState()
    const [description, setDescription] = useState()
    const [keyWords, setKeyWords] = useState()
    const [editor, setEditor] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [results, setResults] = useState([{ question: "", answer: "" }])
    const [butLoading, setButLoading] = useState(false)

    const butOverride = css`
    display: block;
    text-align: center;
    `;
    
    const rateOptions = [
        { value: 0, label: '0' },
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' }
    ]
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
            .get("/api/v1/articles/create").then((response) => {
                const category = response.data.data.category.map((item) => {
                    return { value: item.id, label: item.name }
                })
                setCategoryOptions(category)
                const tag = response.data.data.tag.map((item) => {
                    return { value: item.id, label: item.name }
                })
                setTagOptions(tag)
            }).catch((err) => {
                if (err.response.status == 401) {
                    window.location.href = '/'
                }
                if (err.response.status == 403) {
                    window.location.href = '/FourOThree'
                }
            })

    }, [])
    /**
     * seting the input state to the value of the item that user wants to edit
     *
     */
    useEffect(() => {
        baseUrl
            .get(`/api/v1/articles/${id}/edit`)
            .then((response) => {
                const data = response.data.data.data
                console.log(data);
                setInputText(data.title)
                setLatin(data.latin)
                setEditor(data.content)
                setDescription(data.description)
                if(data.faq.length) {
                    setResults(data.faq.map((f) => {
                        return { question: f.question, answer: f.answer }
                    }))
                }
                setKeyWords(data.keywords)
                setInputTextRateValue(data.rate_value)
                setSelectedTagOption(data.tag.map((t) => {
                    return { value: t.id, label: t.name }
                }))
                setSelectedCategoryOption(data.category.map((c) => {
                    return { value: c.id, label: c.name }
                }))
                const rate = (x) => {
                    switch (x) {
                        case 0:
                            return { value: 0, label: '0' }
                            break;
                        case 1:
                            return { value: 1, label: '1' }
                            break;
                        case 2:
                            return { value: 2, label: '2' }
                            break;
                        case 3:
                            return { value: 3, label: '3' }
                            break;
                        case 4:
                            return { value: 4, label: '4' }
                            break;
                        case 5:
                            return { value: 5, label: '5' }
                            break;

                        default:
                            break;
                    }
                }
                setSelectedRateOption(rate(data.rate))
                setImageUrl(`https://panel.farostaha.net${data.image}`)
                setLoading(false);
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
     * displaying the image that user selects
     *
     */
    useEffect(() => {
        if (selectedImage) {
            setImageUrl(URL.createObjectURL(selectedImage));
        }
    }, [selectedImage]);



    /**
     * editing the item with put request
     *
     * @param {event obj} e
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        setButLoading(true)
        if (selectedTagOption &&
            selectedCategoryOption &&
            inputText &&
            description &&
            editor &&
            keyWords 
        ) {
            const tags = selectedTagOption.map((tag) => {
                return tag.value
            })
            const categories = selectedCategoryOption.map((category) => {
                return category.value
            })
            const formData = new FormData();
            formData.append("title", inputText);
            formData.append("latin", latin);
            formData.append("rate", selectedRateOption.value ? selectedRateOption.value : 0);
            formData.append("rate_value", inputTextRateValue ? inputTextRateValue : 0 );
            formData.append("description", description);
            formData.append("content", editor);
            formData.append("image", selectedImage);
            formData.append("keywords", keyWords);
            formData.append("tag_id", JSON.stringify(tags));
            formData.append("category_id", JSON.stringify(categories));
            formData.append("faqs", JSON.stringify(results));
            formData.append("_method", "PUT");
            baseUrl
                .post(`/api/v1/articles/${id}`, formData)
                .then((response) => {
                    const MySwal = withReactContent(Swal);
                    MySwal.fire({
                        confirmButtonText: "باشه",
                        title: "ویرایش شد ",
                        icon: "success",
                    }).then((response) => {
                        setTimeout((window.location.pathname = "/articles"), 2000);
                    });
                })
                .catch((err) => {
                    errorsCatch(err.response.data);
                    setButLoading(false)
                });
        } else {
            Swal.fire({
                confirmButtonText: "باشه",
                title: "لطفا موارد را وارد کنید",
                icon: "error",
            }).then(() => {
                setButLoading(false)
              })
        }
    };
    /**
         * saving the image that user selects inside state
         *
         * @param {event obj} e
         */
    const handleInputChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };



    const handleChangeCategory = (selectedCategoryOption) => {
        setSelectedCategoryOption(selectedCategoryOption);
    };
    const handleChangeTag = (selectedTagOption) => {
        setSelectedTagOption(selectedTagOption);
    };
    const handleChangeRate = (selectedRateOption) => {
        setSelectedRateOption(selectedRateOption);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setResults([...results, { question: "", answer: "" }])
    }

    // handle click event of the Remove button
    const handleRemoveClick = (index) => {
        const list = [...results]
        list.splice(index, 1)
        setResults(list)
    }

    // handle input change
    const handleChange = (e, index) => {
        const { name, value } = e.target
        const list = [...results]
        list[index][name] = value
        setResults(list)
    }

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
                            <div className="col-12  p-4 light rounded shadow bg-light">
                                <h2 className="text-center mb-3">ویرایش  مقاله</h2>
                                <form
                                    className="d-flex flex-column align-items-center"
                                    onSubmit={handleSubmit}
                                >
                                    <input
                                        autoFocus
                                        className="form-control w-75  mt-4 mb-4"
                                        type="text"
                                        placeholder="عنوان"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                    />
                                    <input
                                        autoFocus
                                        className="form-control w-75 mb-2"
                                        type="text"
                                        placeholder="نامک"
                                        value={latin}
                                        onChange={(e) => setLatin(e.target.value)}
                                    />
                                    <Select
                                        options={rateOptions}
                                        name="rate"
                                        className="basic-multi-select mb-3 pt-3 text-right w-75 "
                                        placeholder="امتیاز"
                                        classNamePrefix="select"

                                        value={selectedRateOption}
                                        onChange={handleChangeRate}
                                    />
                                    <input
                                        className="form-control w-75  mb-2"
                                        type="number"
                                        placeholder="مقدار امتیاز"
                                        value={inputTextRateValue}
                                        onChange={(e) => setInputTextRateValue(e.target.value)}
                                    />
                                    <Select
                                        options={categoryOptions}
                                        placeholder="دسته بندی"
                                        name="category"
                                        isMulti
                                        value={selectedCategoryOption}
                                        className="basic-multi-select pt-3 text-right w-75 "
                                        classNamePrefix="select"
                                        onChange={handleChangeCategory}
                                    />
                                    <Select
                                        options={tagOptions}
                                        placeholder="برچسب"
                                        name="tag"
                                        isMulti
                                        value={selectedTagOption}
                                        className="basic-multi-select pt-3 mb-3 text-right w-75 "
                                        classNamePrefix="select"
                                        onChange={handleChangeTag}
                                    />
                                    <textarea
                                        placeholder="توضیحات"
                                        className="form-control w-75  mb-4"
                                        value={description}
                                        onChange={e => { setDescription(e.target.value) }}
                                    />
                                    <textarea
                                        placeholder="کلمات کلیدی"
                                        className="form-control w-75  mb-4"
                                        value={keyWords}
                                        onChange={e => { setKeyWords(e.target.value) }}
                                    />
                                    <div className="article-image-container">
                                        <div className="dropzone ">
                                            {imageUrl && (
                                                <img
                                                    src={imageUrl}
alt=''
                                                    className="h-100 w-50"
                                                />
                                            )}

                                            <input
                                                type="file"
                                                accept="image/jpg, image/jpeg, image/png , image/bmp"
                                                className="upload-input-article"
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-info btn-block"
                                            name="uploadbutton"
                                        >
                                            بارگذاری عکس شاخص
                                        </button>

                                    </div>
                                    <div className="w-100 h-100 wrap mt-5">
                                        <MyEditor
                                            handleChange={(data) => {
                                                setEditor(data);
                                            }}
                                            data={editor}
                                            API_URL = "/api/v1/article/upload-image"
                                        />
                                    </div>

                                    <br></br>
                                    <br></br>
                                    <div className="text-right w-100">
                                        <div className="tittle m-auto">
                                        سوالات متداول
                                        </div>
                                        {results?.map((result, index) => {
                                            return (
                                                <div className="col-12 m-auto" key={index}>
                                                    <div className="d-flex">


                                                        <input
                                                            name="question"
                                                            className="form-control w-50 mb-3 text-wrap text-break"
                                                            placeholder="سوال"
                                                            value={result.question}
                                                            onChange={(e) => handleChange(e, index)}
                                                        />
                                                        <input
                                                            name="answer"
                                                            className="form-control w-50 mb-3 text-wrap text-break"
                                                            placeholder="جواب"
                                                            value={result.answer}
                                                            onChange={(e) => handleChange(e, index)}
                                                        />
                                                        {results.length !== 1 && (
                                                            <button type="button" className=" btn btn-danger mb-3" onClick={() => handleRemoveClick(index)}>
                                                                حذف
                                                            </button>
                                                        )}
                                                    </div>
                                                    {results.length - 1 === index && (
                                                        <button type="button" className=" btn btn-primary mb-3" onClick={handleAddClick}>اضافه کردن</button>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
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

export default EditArticles;
