const routesCONST = {
  home: {
    path: "/home",
    name: "Home"
  },
  board: {
    path: "/board",
    name: "Board"
  },
  user: {
    path: "/user",
    name: "User"
  },
  about: {
    path: "/about",
    name: "About"
  },
  login: {
    path: "/login",
    name: "Login"
  },
  affair: {
    path: "/affair",
    name: "Affair"
  },
  pv: {
    path: "/pv",
    name: "Pv"
  },
  addAffair: {
    path: "/addAffair",
    name: "AddAffair"
  },
  addPv: {
    path: "/addPv",
    name: "AddPv"
  },
  test: {
    path: "/test",
    name: "Test"
  }
};

export const getRouteName = name => {
  return routesCONST[name].name;
};

export const getRoutePath = path => {
  return routesCONST[path].path;
};

export default routesCONST;
