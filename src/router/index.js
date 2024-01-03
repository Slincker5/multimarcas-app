import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        requiresAuth: true,
        title: "Panel de Administracion"
      }
    },
    {
      path: '/crear-cintillos',
      name: 'crearcintillos',
      component: () => import('../views/CrearCintillosView.vue'),
      meta: {
        requiresAuth: true,
        title: "Crear Cintillos"
      }
    },
    {
      path: '/cintillos',
      name: 'cintillos',
      component: () => import('../views/ListaCintillosView.vue'),
      meta: {
        requiresAuth: true,
        title: "Lista de Cintillos"
      }
    },
    {
      path: '/crear-afiches',
      name: 'crearafiches',
      component: () => import('../views/CrearAfichesView.vue'),
      meta: {
        requiresAuth: true,
        title: "Crear Super Ofertas | Formato 1x4"
      }
    },
    {
      path: '/crear-afiches-mini',
      name: 'crearafichesmini',
      component: () => import('../views/CrearAfichesMiniView.vue'),
      meta: {
        requiresAuth: true,
        title: "Crear Super Ofertas | Formato 1x9"
      }
    },
    {
      path: '/crear-afiches-baja-mini',
      name: 'crearafichesbajamini',
      component: () => import('../views/CrearAfichesBajaMiniView.vue'),
      meta: {
        requiresAuth: true,
        title: "Crear Afiche Baja de Precio | Formato 1x9"
      }
    },
    {
      path: '/afiches-seleccion',
      name: 'afiches-seleccion',
      component: () => import('../views/AfichesSeleccionView.vue'),
      meta: {
        requiresAuth: true,
        title: "Categoria de Afiches"
      }
    },
    {
      path: '/afiches',
      name: 'afiches',
      component: () => import('../views/ListaAfichesView.vue'),
      meta: {
        requiresAuth: true,
        title: "Lista de Afiches | Formato 1x4"
      }
    },
    {
      path: '/afiches-mini',
      name: 'afichesmini',
      component: () => import('../views/ListaAfichesMiniView.vue'),
      meta: {
        requiresAuth: true,
        title: "Lista Super Oferta | Formato 1x9"
      }
    },
    {
      path: '/lista-afiches-baja-mini',
      name: 'listaafichesbajamini',
      component: () => import('../views/ListaAfichesBajaMiniView.vue'),
      meta: {
        requiresAuth: true,
        title: "Lista Baja de Precio | Formato 1x9"
      }
    },
    {
      path: '/enviar-afiches',
      name: 'enviarafiches',
      component: () => import('../views/EnviarAfichesView.vue'),
      meta: {
        requiresAuth: true,
        title: "Envio de Afiches | Formato 1x4"
      }
    },
    {
      path: '/enviar-afiches-mini',
      name: 'enviarafichesmini',
      component: () => import('../views/EnviarAfichesMiniView.vue'),
      meta: {
        requiresAuth: true,
        title: "Envio de Afiches | Formato 1x9"
      }
    },
    {
      path: '/enviar-afiches-baja-mini',
      name: 'enviarafichesbajamini',
      component: () => import('../views/EnviarAfichesBajaMini.vue'),
      meta: {
        requiresAuth: true,
        title: "Envio de Afiches Baja | Formato 1x9"
      }
    },
    {
      path: '/editar/:uuid',
      name: 'editarcintillo',
      component: () => import('../views/EditarCintilloView.vue'),
      meta: {
        requiresAuth: true,
        title: "Editar Cintillo"
      }
    },
    {
      path: '/publicacion/:post_uuid',
      name: 'publicacion',
      component: () => import('../views/PublicacionView.vue'),
      meta: {
        requiresAuth: true,
        title: "Publicacion"
      }
    },
    {
      path: '/enviar-cintillos',
      name: 'enviarCintillos',
      component: () => import('../views/EnviarCintillosView.vue'),
      meta: {
        requiresAuth: true,
        title: "Enviar Cintillosw"
      }
    },
    {
      path: '/correo-personalizado',
      name: 'correoPersonal',
      component: () => import('../views/CorreoPersonalizadoView.vue'),
      meta: {
        requiresAuth: true,
        title: "Correo Personalizado"
      }
    },
    {
      path: '/descargas',
      name: 'generar',
      component: () => import('../views/DescargaCintillosView.vue'),
      meta: {
        requiresAuth: true,
        title: "Generar Cintillos"
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        title: "MULTIMARCAS APP"
      }
    },
    {
      path: '/register',
      name: 'registro',
      component: () => import('../views/RegisterView.vue'),
      meta: {
        title: "Crear Cuenta"
      }
    },
    {
      path: '/buscador',
      name: 'buscador',
      component: () => import('../views/BuscadorView.vue'),
      meta: {
        requiresAuth: true,
        title: "Buscador de Internos"
      }
    },
    {
      path: '/politica-y-privacidad',
      name: 'politicayprivacidad',
      component: () => import('../views/PoliticaPrivacidadView.vue'),
      meta: {
        title: "Politica y Privacidad"
      }
    },
    {
      path: '/suscribe',
      name: 'suscribe',
      component: () => import('../views/EscanerView.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ]
})

// proteger las rutas
router.beforeEach((to, from, next) => {
  // Lógica para manejar la autenticación
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!localStorage.getItem('token')) {
      next({
        path: '/login'
      });
      return; // Asegúrate de retornar aquí para evitar que se ejecute el código siguiente
    }
  } else {
    if (to.path === '/register' && localStorage.getItem('token') || to.path === '/login' && localStorage.getItem('token')) {
      next('/');
      return; // Asegúrate de retornar aquí para evitar que se ejecute el código siguiente
    }
  }

  // Lógica para establecer el título
  const pageTitle = to.meta.title;
  if (pageTitle) {
    document.title = pageTitle;
  }

  next();
});


export default router
