import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";



/**
 * if there is an error from api this function shows it to the user using sweetalert2 outside library
 *  
 * @param {response from api} data 
 */
export const errorsCatch = (data) => {
  let err = Object.values(data.errors);    
  if (err.length) {
    let errors = err.flat(2);
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      didOpen: () => {
        MySwal.clickConfirm();
      },
    }).then(() => {
      return MySwal.fire({
        icon: "error",
        title: "خطا",
        text: errors[0],
        confirmButtonText: "باشه",
      });
    });
  } else {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      didOpen: () => {
        MySwal.clickConfirm();
      },
    }).then(() => {
      return MySwal.fire({
        icon: "error",
        title: "خطا",
        text: `${data.message}`,
        confirmButtonText: "باشه",
      });
    });
  }
};
