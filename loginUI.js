let originalLoginOptionsHTML;

window.onload = () => {
    originalLoginOptionsHTML = document.getElementById("login_options").innerHTML;
};

function GoBack() {
    document.getElementById("login_options").innerHTML = originalLoginOptionsHTML;
}

function Login(type) {
    let title = "";
    let placeholder = "";
    let signupFn = "";

    if (type === "user") {
        title = "User Login";
        placeholder = "Username/Email";
        signupFn = "CreateAccount('user')";
    } else if (type === "company") {
        title = "Company Login";
        placeholder = "Company/Email";
        signupFn = "CreateAccount('company')";
    }

    document.getElementById("login_options").innerHTML = `
        <div class="login_div">
            <h2>${title}</h2>
            <form action="/login" method="POST">
                <table id="login_form">
                    <tr>
                        <td>${placeholder}</td>
                        <td><input type="text" name="username" required></td>
                    </tr>
                    <tr>
                        <td>Password</td>
                        <td><input type="password" name="password" required></td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <button type="submit">Login</button><br><br>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            Don't have an account?
                            <button type="button" onclick="${signupFn}">Sign up</button>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <button type="button" class="back" onclick="GoBack()">Back</button>
                        </td>
                    </tr>
                </table>
            </form>
        </div>
    `;
}

function CreateAccount(type) {
    let title = "";
    let fields = "";
    let extraFields = "";

    if (type === "user") {
        title = "Create User Account";
        fields = `
            <label>Enter Username</label><br>
            <input type="text" name="username" required><br><br>

            <label>Enter Email</label><br>
            <input type="email" name="email" required><br><br>

            <label>Enter Date of Birth</label><br>
            <input type="date" name="dob" max="2007-06-09" required><br><br>
        `;
        extraFields = `<input type="hidden" name="type" value="user">`;
    } else if (type === "company") {
        title = "Create Company Account";
        fields = `
            <label>Enter Company Name</label><br>
            <input type="text" name="companyName" required><br><br>

            <label>Enter Company Email</label><br>
            <input type="email" name="email" required><br><br>

            <label>Enter Company Number</label><br>
            <input type="text" name="companyNumber" required><br><br>
        `;
        extraFields = `<input type="hidden" name="type" value="company">`;
    }

    document.getElementById("login_options").innerHTML = `
        <div class="login_div acc_details">
            <h2>${title}</h2>
            <form action="/register" method="POST">
                ${fields}

                <label>Enter Password</label><br>
                <input type="password" name="password" required><br><br>

                <label>Confirm Password</label><br>
                <input type="password" name="confirm_password" required><br><br>

                ${extraFields}

                <p id="${type}_error" style="color:red;"></p>

                <button type="submit">Create Account</button>
                <button type="button" class="back" onclick="GoBack()">Back</button>
            </form>
        </div>
    `;
}
