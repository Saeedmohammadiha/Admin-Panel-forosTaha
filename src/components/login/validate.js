

/**
 * this function validates users phone , password before sending to server
 *  
 * @param {phone , password } values 
 * @returns errors
 */

export const validate = (values) => {
    let errors = {}

    if (!values.phone.trim()) {
    errors.phone = 'شماره همراه را وارد کنید'
    } else if (values.phone.length < 11) {
        errors.phone = 'شماره همراه باید 11 کارکتر باشد '
    }
    

    if (!values.password) {
        errors.password  = 'پسورد را وارد کنید'
    } else if (values.password.length < 8) {
        errors.password = 'پسورد باید حداقل 8 کارکتر باشد'
    }
    

    return errors
}