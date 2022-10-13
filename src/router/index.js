import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ContactView from "../views/ContactView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                el: to.hash,
                top: 16,
                behavior: "smooth",
            };
        }
    },
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        // {
        //     path: "/contact",
        //     name: "contact",
        //     component: ContactView,
        // },
    ],
});

export default router;
