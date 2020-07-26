const functions = require('./functions');

test('Create valid User', () => {
    expect(functions.createUser("e0407663","123456", "123456", "Nguyen Khanh Duy")).toEqual({
        email: "e0407663@u.nus.edu",
        password: "123456",
        confirmedPassword: "123456",
        username: "Nguyen Khanh Duy"
    });
});