import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
		path: '/admin',
		name: 'admin',
		component: () => import('@/views/AdminView.vue'),
    },
    {
		path: '/admin/editor',
		name: 'editor',
		component: () => import('@/views/EditorView.vue'),
    },
    {
		path: '/admin/images',
		name: 'gallery',
		component: () => import('@/views/ImageGalleryView.vue'),
	},
    {
      path: '/:pathMatch(.*)*',
      name: 'renderer', // need to make this nicer, maybe configurable or get from markdown
      component: () => import('@/views/RenderView.vue'),
    }
  ],

})

router.afterEach((to) => {
  if (to.path === '/') {
	document.title = 'home';
  if (to.name === 'renderer') {
    document.title = to.path.split('/').pop() || 'OsPress';
  } else {
	document.title = to.name as string;
  }
})

export default router
