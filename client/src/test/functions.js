const functions = {
    createUser: (email, password, confirmedpassword, username) => {
        if (email === '' || password === '' || confirmedpassword === '' || username === '') {
            return false;
        }
        const user = { email: email + "@u.nus.edu" };
        if (password.length < 6 || password !== confirmedpassword) {
            return false;
        } else {
            user['password'] = password;
            user['confirmedPassword'] = confirmedpassword;
            user['username'] = username;
        }
        return user;
    }
}

module.exports = functions;