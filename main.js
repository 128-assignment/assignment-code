const http = require('http');
const fs = require('fs');
const mysql = require('mysql');
const querystring = require('querystring');
const path = require('path');

// ====== In-memory session ======
let session = {};
function setSession(username, userType, userId) {
    session = { userName: username, userType, userId };
}
function getSession() {
    return session;
}
function deleteSession() {
    session = {};
}

// ====== Connect to MySQL ======
function connectToDB() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "admin", // Change if needed
        database: "loginSystem"
    });
}

// ====== Start HTTP server ======
http.createServer((req, res) => {
    let body = "";

    // === LOGIN ===
    if (req.url === "/login") {
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            body = querystring.parse(body);

            const username = body.username?.trim();
            const password = body.password?.trim();
            console.log("Login attempt with:", username, password);

            const con = connectToDB();
            con.connect(err => {
                if (err) throw err;

                const checkUser = "SELECT * FROM users WHERE username = ? AND password = ?";
                con.query(checkUser, [username, password], (err, userResult) => {
                    if (err) throw err;

                    console.log("User query result:", userResult);

                    if (userResult.length > 0) {
                        setSession(username, "user", userResult[0].id);
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.write(`<html><body>
                            <script>
                                alert('Login successful!');
                                window.location.href = "/home";
                            </script>
                        </body></html>`);
                        return res.end();
                    } else {
                        const checkCompany = "SELECT * FROM companies WHERE company_name = ? AND password = ?";
                        con.query(checkCompany, [username, password], (err, companyResult) => {
                            if (err) throw err;

                            console.log("Company query result:", companyResult);

                            if (companyResult.length > 0) {
                                setSession(username, "company", companyResult[0].id);
                                res.writeHead(200, { 'Content-Type': 'text/html' });
                                res.write(`<html><body>
                                    <script>
                                        alert('Login successful!');
                                        window.location.href = "/home";
                                    </script>
                                </body></html>`);
                                return res.end();
                            } else {
                                res.writeHead(200, { 'Content-Type': 'text/html' });
                                res.write(`<html><body>
                                    <script>
                                        alert('Incorrect username or password.');
                                        window.location.href = "/";
                                    </script>
                                </body></html>`);
                                return res.end();
                            }
                        });
                    }
                });
            });
        });

    // === REGISTER ===
    } else if (req.url === "/register") {
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            body = querystring.parse(body);

            const type = body.type;
            const password = body.password?.trim();
            const confirmPassword = body.confirm_password?.trim();

            if (password !== confirmPassword) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(`<html><body>
                    <script>
                        alert("Passwords do not match.");
                        window.location.href = "/";
                    </script>
                </body></html>`);
                return res.end();
            }

            const con = connectToDB();

            if (type === "user") {
                const username = body.username?.trim();
                const email = body.email?.trim();
                const dob = body.dob;

                const sql = `INSERT INTO users (username, email, password, date_of_birth) VALUES (?, ?, ?, ?)`;
                const values = [username, email, password, dob];

                con.query(sql, values, (err) => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(`<html><body>
                        <script>
                            alert('${err ? 'Registration failed.' : 'User account created!'}');
                            window.location.href = "/";
                        </script>
                    </body></html>`);
                    return res.end();
                });

            } else if (type === "company") {
                const companyName = body.companyName?.trim();
                const email = body.email?.trim();
                const phone = body.companyNumber?.trim();

                const sql = `INSERT INTO companies (company_name, email, phone, password) VALUES (?, ?, ?, ?)`;
                const values = [companyName, email, phone, password];

                con.query(sql, values, (err) => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(`<html><body>
                        <script>
                            alert('${err ? 'Registration failed.' : 'Company account created!'}');
                            window.location.href = "/";
                        </script>
                    </body></html>`);
                    return res.end();
                });
            }
        });

    // === LOGOUT ===
    } else if (req.url === "/logout") {
        deleteSession();
        fs.readFile("login.html", (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            return res.end();
        });

    // === HOME ===
    } else if (req.url === "/home") {
        const s = getSession();
        if (s && s.userName) {
            fs.readFile("homepage.html", (err, data) => {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
                return res.end();
            });
        } else {
            fs.readFile("login.html", (err, data) => {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
                return res.end();
            });
        }

    // === STATIC FILES ===
    } else if (req.method === "GET" && /\.(css|js|png|jpg|jpeg|gif)$/i.test(req.url)) {
        const filePath = path.join(__dirname, req.url);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end("404 Not Found");
            } else {
                let contentType = "text/plain";
                if (req.url.endsWith(".css")) contentType = "text/css";
                else if (req.url.endsWith(".js")) contentType = "application/javascript";
                else if (req.url.endsWith(".png")) contentType = "image/png";
                else if (req.url.endsWith(".jpg") || req.url.endsWith(".jpeg")) contentType = "image/jpeg";
                else if (req.url.endsWith(".gif")) contentType = "image/gif";

                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });

    // === DEFAULT ROUTE ===
    } else {
        fs.readFile("login.html", (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            return res.end();
        });
    }

}).listen(8080);

console.log("Server running at http://localhost:8080");
