const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { 
        path: "", 
        component: () => import("pages/DashboardPage.vue"),
        meta: { transition: 'fade' }
      },
      { 
        path: "lesson-picker", 
        component: () => import("pages/LessonPicker.vue"),
        meta: { transition: 'fade' }
      },
      { 
        path: "lesson", 
        name: "LessonPage",
        component: () => import("pages/LessonPage.vue"),
        meta: { transition: 'fade' }
      },
      {
        path: "results",
        name: "ResultsPage",
        component: () => import("pages/ResultsPage.vue"),
        meta: { transition: 'fade' }
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
    meta: { transition: 'fade' }
  },
];

export default routes;
