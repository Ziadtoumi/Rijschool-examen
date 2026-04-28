// LOGIN
async function login() {
    try {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("name", data.name);
            window.location.href = "dashboard.html";
        } else {
            alert(data.msg);
        }
    } catch (error) {
        alert("Server fout");
    }
}

// REGISTER
async function register() {
    try {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Registratie gelukt!");
            window.location.href = "login.html";
        } else {
            alert(data.msg);
        }
    } catch (error) {
        alert("Server fout");
    }
}