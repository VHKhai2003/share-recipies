const usernameValidate = (username) => {
    const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9_-]{3,23}$/;
    if (username === null || username === undefined) {
        throw new Error("Invalid username");
    }

    if (!USER_REGEX.test(username)) {
        throw new Error("Invalid username");
    }

    return username;
}

const passwordValidate = (password) => {
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
    if (password === null || password === undefined) {
        throw new Error("Invalid password");
    }

    if (!PWD_REGEX.test(password)) {
        throw new Error("Invalid password");
    }

    return password;
}

const uuidValidate = (uuid) => {
    const UUID_REGEX = /^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$/;
    if (uuid === null || uuid === undefined) {
        throw new Error('Invalid uuid');
    }
    if (!UUID_REGEX.test(uuid)) {
        throw new Error('Invalid uuid');
    }
    return uuid;
}


const emailValidate = (email) => {
    const EMAIL_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (email === null || email === undefined) {
        throw new Error('Invalid email');
    }
    if (!EMAIL_REGEX.test(email)) {
        throw new Error("Invalid email");
    }
    return email;
}

const phoneValidate = (phone) => {
    const PHONE_REGEX = /(84|0[3|5|7|8|9])+([0-9]{8})/;
    if (phone === null || phone === undefined) {
        throw new Error("Invalid phone number");
    }
    if (!PHONE_REGEX.test(phone)) {
        throw new Error("Invalid phone number");
    }
    return phone;
}


module.exports = { 
    usernameValidate, 
    passwordValidate, 
    uuidValidate, 
    emailValidate, 
    phoneValidate 
};
