import { createRouter, createWebHistory } from "vue-router";
import Transfer from "./components/Transfer.vue";
import PayOrder from "./components/PayOrder.vue";

const routes = [
  {
    path: "/",
    name: "PayOrder",
    component: PayOrder,
  },
  {
    path: "/:value/:ern_value",
    name: "receive_transfer_data",
    component: Transfer,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
