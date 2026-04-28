// ==================
// AUTH FUNCTIES
// ==================

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

// ==================
// VUE DASHBOARD
// ==================

if (document.getElementById("app")) {
    const { createApp } = Vue;

    createApp({
        data() {
            return {
                username: localStorage.getItem("name") || "Student",
                lessons: [],
                loading: true,
                newLesson: {
                    title: "",
                    date: "",
                    time: "10:00"
                }
            };
        },

        computed: {
            upcomingLessons() {
                return this.lessons.filter(l => l.status === "upcoming");
            },
            upcomingCount() {
                return this.lessons.filter(l => l.status === "upcoming").length;
            },
            completedCount() {
                return this.lessons.filter(l => l.status === "completed").length;
            },
            cancelledCount() {
                return this.lessons.filter(l => l.status === "cancelled").length;
            }
        },

        methods: {
            async fetchLessons() {
                try {
                    const token = localStorage.getItem("token");
                    const res = await fetch("/api/lessons", {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    this.lessons = await res.json();
                } catch (err) {
                    console.error("Fout bij laden lessen:", err);
                } finally {
                    this.loading = false;
                }
            },

            async addLesson() {
                if (!this.newLesson.title || !this.newLesson.date) {
                    alert("Vul les type en datum in");
                    return;
                }

                try {
                    const token = localStorage.getItem("token");
                    const res = await fetch("/api/lessons", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(this.newLesson)
                    });

                    if (res.ok) {
                        this.newLesson = { title: "", date: "", time: "10:00" };
                        await this.fetchLessons();
                    } else {
                        alert("Fout bij toevoegen");
                    }
                } catch (err) {
                    alert("Server fout");
                }
            },

            async cancelLesson(id) {
                if (!confirm("Les annuleren?")) return;

                try {
                    const token = localStorage.getItem("token");
                    await fetch(`/api/lessons/${id}`, {
                        method: "DELETE",
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    await this.fetchLessons();
                } catch (err) {
                    alert("Server fout");
                }
            },

            logout() {
                localStorage.removeItem("token");
                localStorage.removeItem("name");
                window.location.href = "login.html";
            },

            formatMonth(date) {
                return new Date(date).toLocaleString("nl", { month: "short" });
            },

            formatDay(date) {
                return new Date(date).getDate();
            },

            formatTime(time) {
                return time ? time.substring(0, 5) : "10:00";
            }
        },

        mounted() {
            if (!localStorage.getItem("token")) {
                window.location.href = "login.html";
                return;
            }
            this.fetchLessons();
        }

    }).mount("#app");
}