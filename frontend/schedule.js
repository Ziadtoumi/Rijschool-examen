const { createApp } = Vue;

createApp({
    data() {
        return {
            lessons: [],
            currentMonth: new Date().getMonth(),
            currentYear: new Date().getFullYear(),
            selectedDay: null,
            bookedTimesForDay: [],
            allTimes: [
                "09:00:00", "10:00:00", "11:00:00", "12:00:00",
                "13:00:00", "14:00:00", "15:00:00", "16:00:00",
                "17:00:00", "18:00:00"
            ],
            dayNames: ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"],
            monthNames: ["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"],
            showCancelModal: false,
            cancelLessonId: null
        };
    },

    computed: {
        monthName() {
            return this.monthNames[this.currentMonth];
        },

        calendarDays() {
            const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
            const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
            const offset = (firstDay === 0 ? 6 : firstDay - 1);
            const days = [];
            for (let i = 0; i < offset; i++) days.push(null);
            for (let i = 1; i <= daysInMonth; i++) days.push(i);
            return days;
        },

        upcomingLessons() {
            return this.lessons.filter(l => l.status === "upcoming");
        },

        cancelledLessons() {
            return this.lessons.filter(l => l.status === "cancelled");
        },

        selectedDayLabel() {
            if (!this.selectedDay) return "";
            const date = new Date(this.currentYear, this.currentMonth, this.selectedDay);
            return date.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" });
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
                console.error(err);
            }
        },

        async selectDay(day) {
            this.selectedDay = day;
            const dateStr = this.getDateStr(day);
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`/api/lessons/booked?date=${dateStr}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                this.bookedTimesForDay = data.map(t => t.length === 5 ? t + ":00" : t);
            } catch (err) {
                console.error(err);
            }
        },

        async bookSlot(time) {
            const dateStr = this.getDateStr(this.selectedDay);
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("/api/lessons", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ date: dateStr, time })
                });

                const data = await res.json();
                if (res.ok) {
                    await this.fetchLessons();
                    await this.selectDay(this.selectedDay);
                } else {
                    alert(data.msg);
                }
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
                if (this.selectedDay) await this.selectDay(this.selectedDay);
            } catch (err) {
                alert("Server fout");
            }
        },

        getDateStr(day) {
            const m = String(this.currentMonth + 1).padStart(2, "0");
            const d = String(day).padStart(2, "0");
            return `${this.currentYear}-${m}-${d}`;
        },

        isBooked(time) {
            return this.bookedTimesForDay.includes(time) && !this.isMine(time);
        },

        isMine(time) {
            if (!this.selectedDay) return false;
            const dateStr = this.getDateStr(this.selectedDay);
            return this.lessons.some(l => {
                const lessonDate = l.date.substring(0, 10);
                return l.status === "upcoming" && lessonDate === dateStr && l.time === time;
            });
        },

        hasLesson(day) {
            if (!day) return false;
            const dateStr = this.getDateStr(day);
            return this.lessons.some(l => {
                const lessonDate = l.date.substring(0, 10);
                return l.status === "upcoming" && lessonDate === dateStr;
            });
        },

        isToday(day) {
            if (!day) return false;
            const today = new Date();
            return day === today.getDate() &&
                this.currentMonth === today.getMonth() &&
                this.currentYear === today.getFullYear();
        },

        isSelected(day) {
            return day === this.selectedDay;
        },

        prevMonth() {
            if (this.currentMonth === 0) {
                this.currentMonth = 11;
                this.currentYear--;
            } else {
                this.currentMonth--;
            }
            this.selectedDay = null;
        },

        nextMonth() {
            if (this.currentMonth === 11) {
                this.currentMonth = 0;
                this.currentYear++;
            } else {
                this.currentMonth++;
            }
            this.selectedDay = null;
        },

        formatDate(date) {
            const parts = date.substring(0, 10).split("-");
            const d = new Date(parts[0], parts[1] - 1, parts[2]);
            return d.toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
        },

        formatTime(time) {
            return time ? time.substring(0, 5) : "";
        },

        logout() {
            localStorage.removeItem("token");
            localStorage.removeItem("name");
            window.location.href = "login.html";
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