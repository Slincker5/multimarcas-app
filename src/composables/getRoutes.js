export const useGetRoutes = () => {
  // Ruta global
  const url = `https://api.multimarcas.app`;
  //const url = `http://localhost`;
  const userNoPhoto = "https://cintillos-plazamundo.netlify.app/usuario.png";

  // Rutas externas
  const getIp = "https://api.ipify.org?format=json";

  // Rutas de autenticacion
  const authLogin = `${url}/api/auth/login`;
  const authRegister = `${url}/api/auth/register`;
  const authLoginWithGoogle = `${url}/api/auth/login-with-google`;
  const authValidarEmail = `${url}/api/auth/validar-email`;
  const authValidarTelefono = `${url}/api/auth/validar-telefono`;

  // Rutas usuario
  const userStat = `${url}/api/user/stats`;
  const userMvc = `${url}/api/temp/mvc`;
  const userUpdateToken = `${url}/api/temp/update-token`;

  // Rutas buscador
  const searchLabel = `${url}/api/search/all/`; // luego va el elemento a buscar

  // Rutas Label
  const labelCreate = `${url}/api/label/create`;
  const labelList = `${url}/api/label/list`;
  const labelListGenerated = `${url}/api/label/list-generated`;
  const labelRemove = `${url}/api/label/remove`;
  const labelDetails = `${url}/api/label/details/`;
  const labelEdit = `${url}/api/label/edit`;
  const labelBuild = `${url}/api/label/build-document`;

  // Rutas poster
  const posterCreate = `${url}/api/poster/create`;
  const posterList = `${url}/api/poster/list`;
  const posterBuild = `${url}/api/poster/build`;

  // Rutas poster mini
  const posterSmallCreate = `${url}/api/poster-small/create`;
  const posterSmallList = `${url}/api/poster-small/list`;
  const posterSmallRemoveList = `${url}/api/poster-small/remove`;
  const posterSmallBuild = `${url}/api/poster-small/build`;

  // Rutas poster mini
  const posterSmallBajaCreate = `${url}/api/poster-low-price-small/create`;
  const posterSmallBajaList = `${url}/api/poster-low-price-small/list`;
  const posterSmallBajaBuild = `${url}/api/poster-low-price-small/build`;
  // Rutas Email
  const emailList = `${url}/api/email/list`;

  // Rutas Publicacion
  const postCreate = `${url}/api/post/create`;
  const postList = `${url}/api/post/list`;
  const postRemove = `${url}/api/post/remove`;
  const likePost = `${url}/api/post/like`;
  const likeList = `${url}/api/post/list-like`;
  const selectPost = `${url}/api/post/select-post/`;
  const commentCreate = `${url}/api/comment/create`;
  const commentList = `${url}/api/comment/list/`;

  // Cupones
  const canjearCupon = `${url}/api/premiun/canjear-cupon`;
  const generarCupon = `${url}/api/premiun/cupon`;
  const crearCupon = `${url}/api/premiun/nuevo-cupon`;

  return {
    url,
    authLogin,
    authRegister,
    authLoginWithGoogle,
    authValidarEmail,
    authValidarTelefono,
    getIp,
    userStat,
    userNoPhoto,
    searchLabel,
    labelCreate,
    labelList,
    labelRemove,
    labelEdit,
    labelDetails,
    labelBuild,
    emailList,
    labelListGenerated,
    posterCreate,
    posterList,
    posterBuild,
    posterSmallCreate,
    posterSmallList,
    posterSmallRemoveList,
    posterSmallBuild,
    userMvc,
    userUpdateToken,
    posterSmallBajaCreate,
    posterSmallBajaList,
    posterSmallBajaBuild,
    postCreate,
    postList,
    postRemove,
    likePost,
    likeList,
    selectPost,
    commentCreate,
    commentList,
    canjearCupon,
    generarCupon,
    crearCupon,
  };
};
