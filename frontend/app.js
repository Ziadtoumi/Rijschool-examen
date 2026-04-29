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
                bookedTimes: [],
                allTimes: [
                    "09:00:00", "10:00:00", "11:00:00", "12:00:00",
                    "13:00:00", "14:00:00", "15:00:00", "16:00:00",
                    "17:00:00", "18:00:00"
                ],
                newLesson: {
                    date: "",
                    time: ""
                },
                showCancelModal: false,
                cancelLessonId: null
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

            async fetchBookedTimes() {
                if (!this.newLesson.date) return;
                try {
                    const token = localStorage.getItem("token");
                    const res = await fetch(`/api/lessons/booked?date=${this.newLesson.date}`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    const data = await res.json();
                    this.bookedTimes = data.map(t => t.length === 5 ? t + ":00" : t);
                    this.newLesson.time = "";
                } catch (err) {
                    console.error("Fout bij laden tijden:", err);
                }
            },

            async addLesson() {
                if (!this.newLesson.date || !this.newLesson.time) {
                    alert("Kies een datum en tijdstip");
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

                    const data = await res.json();

                    if (res.ok) {
                        this.newLesson = { date: "", time: "" };
                        this.bookedTimes = [];
                        await this.fetchLessons();
                    } else {
                        alert(data.msg);
                    }
                } catch (err) {
                    alert("Server fout");
                }
            },

            async completeLesson(id) {
                if (!confirm("Les markeren als voltooid?")) return;
                try {
                    const token = localStorage.getItem("token");
                    await fetch(`/api/lessons/${id}/complete`, {
                        method: "PUT",
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    await this.fetchLessons();
                } catch (err) {
                    alert("Server fout");
                }
            },

            openCancelModal(id) {
                this.cancelLessonId = id;
                this.showCancelModal = true;
            },

            closeCancelModal() {
                this.cancelLessonId = null;
                this.showCancelModal = false;
            },

            async confirmCancel() {
                try {
                    const token = localStorage.getItem("token");
                    await fetch(`/api/lessons/${this.cancelLessonId}`, {
                        method: "DELETE",
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    this.closeCancelModal();
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
                return time ? time.substring(0, 5) : "";
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