const routesCONST = {
  home: {
    path: "/homePage",
    name: "HomePage"
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
  addUser: {
    path: "/addUser",
    name: "AddUser"
  },
  addLot: {
    path: "/addLot",
    name: "AddLot"
  },
  finishedPv: {
    path: "/finishedPv",
    name: "FinishedPv"
  },
  test: {
    path: "/test",
    name: "Test"
  },
  test2: {
    path: "/test2",
    name: "Test2"
  }
};

export const getRouteName = name => {
  return routesCONST[name].name;
};

export const getRoutePath = path => {
  return routesCONST[path].path;
};

export default routesCONST;
