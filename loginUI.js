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
            signupFn = "CreateUserAcc()";
        } else if (type === "company") {
            title = "Company Login";
            placeholder = "Company/Email";
            signupFn = "CreateCompanyrAcc()";
        }

        document.getElementById("login_options").innerHTML = `
            <div class="login_div">
                <h2>${title}</h2>
                <form onsubmit="UserAuthenticate(); return false;">
                    <table>
                        <tr>
                            <td>${placeholder}</td>
                            <td><input type="text" id="login_identifier" name="login_identifier" required></td>
                        </tr>
                        <tr>
                            <td>Password</td>
                            <td><input type="password" id="login_password" name="login_password" required></td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <button type="submit">Login</button><br><br>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                Don't have an account?<br>
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
    function UserAuthenticate() {
        const identifier = document.getElementById("login_identifier").value.trim();
        const password = document.getElementById("login_password").value;

        if (!identifier || !password) {
            alert("Please enter both username/email and password.");
            return;
    }
    }

    function CreateUserAcc() {
        document.getElementById("login_options").innerHTML = `
        <div class="login_div acc_details">
        <h2>Create User Account</h2>
        <form>
            <label>Enter Username</label><br>
            <input type="text"><br><br>

            <label>Enter Email</label><br>
            <input type="text"><br><br>

            <label>Enter Date of Birth</label><br>
            <input type="date" max="2007-06-09"><br><br>

            <label>Enter Password</label><br>
            <input type="password"><br><br>

            <label>Confirm Password</label><br>
            <input type="password"><br><br>

            <button type="button">Create Account</button>
            <button type="button" class="back" onclick="GoBack()">Back</button>
        </form>
        </div>
        `
    }

        function CreateCompanyrAcc() {
        document.getElementById("login_options").innerHTML = `
        <div class="login_div acc_details">
        <h2>Create Company Account</h2>
        <form>
            <label>Enter Company name</label><br>
            <input type="text"><br><br>

            <label>Enter Company Email</label><br>
            <input type="text"><br><br>

            <label>Enter Company Number</label><br>
            <input type="text"><br><br>

            <label>Enter Password</label><br>
            <input type="password"><br><br>

            <label>Confirm Password</label><br>
            <input type="password"><br><br>

            <button type="button">Create Account</button>
            <button type="button" class="back" onclick="GoBack()">Back</button>
        </form>
        </div>
        `
    }