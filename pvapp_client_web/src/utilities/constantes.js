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
  test: {
    path: "/test",
    name: "Test"
  }
  
};

export const getpath = name => {
  console.log(name);
    return routesCONST[name].name;
  }

export default routesCONST;
