const app = Vue.createApp({
    data() {
        return {
            email: "",
            password: "",
            loggedIn: false,

            lessons: [],
            newDate: "",
            newTime: ""
        };
    },

    methods: {

        // REGISTER
        async register() {
            await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: this.email,
                    password: this.password
                })
            });

            alert("Account aangemaakt!");
        },

        // LOGIN
        async login() {
            const res = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: this.email,
                    password: this.password
                })
            });

            const data = await res.json();

            if (data.token) {
                localStorage.setItem("token", data.token);
                this.loggedIn = true;
                this.getLessons();
            }
        },

        // GET LESSONS
        async getLessons() {
            const res = await fetch("http://localhost:3000/api/lessons", {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });

            this.lessons = await res.json();
        },

        // ADD LESSON
        async addLesson() {
            await fetch("http://localhost:3000/api/lessons", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                },
                body: JSON.stringify({
                    date: this.newDate,
                    time: this.newTime
                })
            });

            this.getLessons();
        },

        // CANCEL LESSON
        async cancelLesson(id) {
            await fetch(`http://localhost:3000/api/lessons/${id}/cancel`, {
                method: "PUT",
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });

            this.getLessons();
        },

        // LOGOUT
        logout() {
            localStorage.removeItem("token");
            this.loggedIn = false;
            this.lessons = [];
        }
    }
});

app.mount("#app");