export const useGetRoutesAcortador = () => {
  // Ruta global
  const url = `https://api.multimarcas.app`;
  const urlFront = `https://multimarcas.app`;

  // Rutas externas
  const getIp = "https://ipapi.co/json/";

  // principales
  const createLink = `${url}/api/link/create`;
  const listLink = `${url}/api/link/list`;
  const editLink = `${url}/api/link/edit`;
  const removeLink = `${url}/api/link/remove`;
  const clicsLink = `${url}/api/link/clics`;
  const viewLink = `${url}/api/link/view`;
  const viewCountryLink = `${url}/api/link/viewcountry`;

  // otros
  const loggerView = `${url}/api/view/logger`;
  const validateView = `${url}/api/view/validate`;

  return {
    urlFront,
    createLink,
    listLink,
    editLink,
    removeLink,
    clicsLink,
    viewLink,
    viewCountryLink,
    loggerView,
    validateView,
    getIp
  };
};
