import MainLayout from '@/layouts/MainLayout.vue'
import BettingSlipsView from '@/views/BettingSlipsView.vue'
import CostsView from '@/views/CostsView.vue'
import DashboardView from '@/views/DashboardView.vue'
import EmployeesView from '@/views/EmployeesView.vue'
import InvoicingView from '@/views/InvoicingView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      alias: ['/dashboard'],
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView,
        },
        {
          path: 'dashboard/employees',
          name: 'employees',
          component: EmployeesView,
        },
        {
          path: 'dashboard/costs',
          name: 'costs',
          component: CostsView,
        },
        {
          path: 'dashboard/betting-slips',
          name: 'betting-slips',
          component: BettingSlipsView,
        },
        {
          path: 'dashboard/invoicing',
          name: 'invoicing',
          component: InvoicingView,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
