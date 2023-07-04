import axioss from "./axios";

const fecthAll = (page, size) => {
  const config = {
    headers: {
      email: localStorage.getItem("email"),
    },
  };
  return axioss.get(
    `/product/get-all-by-page?page=${page}&size=${size}`,
    config
  );
};

const notify = () => {
  // return axioss.post('/api/v1/order/import')
};

const postCreateUser = (
  fullName,
  email,
  phoneNumber,
  password,
  status,
  roles
) => {
  return axioss.post(
    "/user/add",
    {
      fullName,
      email,
      phoneNumber,
      password,
      status,
      roles: Array.isArray(roles) ? roles : [roles],
    },
    {
      headers: {
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
};

const getUserAdmin = () => {
  const config = {
    headers: {
      email: localStorage.getItem("email"),
    },
  };
  return axioss.get("/user/get-all", config);
};

const loginApi = (email, password) => {
  return axiosss.post("/api/login", { email, password });
};

const loginAdmin = (email, password) => {
  return axioss.post(
    "/user/login",
    { email, password },
    { withCredentials: true }
  );
};

const role = () => {
  const config = {
    headers: {
      email: localStorage.getItem("email"),
    },
  };
  return axioss.get("/role/get-all", config);
};

const sendOTP = (email) => {
  return axioss.post(`/user/forgot-password/sent-otp?email=${email}`);
};

const verifyAPI = (opt, email, password, rePassword) => {
  return axioss.post(
    `/user/forgot-password/verify?OTP=${opt}&email=${email}&newPassword=${password}&rePassword=${rePassword}`
  );
};

const deleteUser = (email) => {
  return axioss.put(`/user/delete/${email}`, null, {
    headers: {
      email: `${localStorage.getItem("email")}`,
    },
  });
};

const updateUser = (email, fullName, phoneNumber, roles) => {
  return axioss.put(
    `/user/update?email=${localStorage.getItem("emailEdit")}`,
    {
      email,
      fullName,
      phoneNumber,
      roles: Array.isArray(roles) ? roles : [roles],
    },
    {
      headers: {
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
};

const resetPassword = (oldPassword, newPassword) => {
  return axioss.post(
    `/user/reset-password?oldPassword=${oldPassword}&newPassword=${newPassword}`,
    null,
    {
      headers: {
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
};

const getUserByEmail = () => {
  const config = {
    headers: {
      email: localStorage.getItem("email"),
    },
  };
  return axioss.get(
    `/user/get-by-id?id=${localStorage.getItem("email")}`,
    config
  );
};

const getAllProduct = () => {
  const config = {
    headers: {
      email: localStorage.getItem("email"),
    },
  };
  return axioss.get("/product/get-all", config);
};

const searchProduct = (keyword, property, pageIndex, pageSize) => {
  return axioss.post(
    "/product/search-by-keyword",
    {
      keyword: Array.isArray(keyword) ? keyword : [keyword],
      property,
      pageIndex,
      pageSize,
    },
    {
      headers: {
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
};

const createPo = (poNumber, quantity, beginAt, endAt) => {
  return axioss.post(
    "/po/add",
    { poNumber, quantity, beginAt, endAt },
    {
      headers: {
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
};

const getPo = () => {
  const config = {
    headers: {
      email: `${localStorage.getItem("email")}`,
    },
  };
  return axioss.get("/po/get-all", config);
};

const updatePo = (poNumber, quantity, beginAt, endAt) => {
  return axioss.put(
    `/po/update/${localStorage.getItem("po")}`,
    { poNumber, quantity, beginAt, endAt },
    {
      headers: {
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
};

const fecthAllPoDetail = (page, size) => {
  const config = {
    headers: {
      email: localStorage.getItem("email"),
    },
  };
  return axioss.get(
    `/po-detail/get-all-by-page?page=${page}&size=${size}`,
    config
  );
};

const getAllPoDetail = () => {
  const config = {
    headers: {
      email: localStorage.getItem("email"),
    },
  };
  return axioss.get("/po-detail/get-all", config);
};

const updateProduct = (productId, productName) => {
  return axioss.put(
    `/product/update/${productId}`,
    { productId, productName },
    {
      headers: {
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
};

const addProduct = (productId, productName) => {
  return axioss.post(
    "/product/add",
    { productId, productName },
    {
      headers: {
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
};

const searchPODetail = (keyword, property, pageIndex, pageSize) => {
  return axioss.post(
    "/po-detail/search-by-keyword",
    {
      keyword: Array.isArray(keyword) ? keyword : [keyword],
      property,
      pageIndex,
      pageSize,
    },
    {
      headers: {
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
};

const updatePoDetail = (
  poDetailId,
  bbbgNumber,
  importDate,
  repairCategory,
  repairStatus,
  exportPartner,
  kcsVT,
  warrantyPeriod
) => {
  return axioss.put(
    `/po-detail/update/${poDetailId}`,
    {
      poDetailId,
      bbbgNumber,
      importDate,
      repairCategory,
      repairStatus,
      exportPartner,
      kcsVT,
      warrantyPeriod,
    },
    {
      headers: {
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
};

const showStatistical = (poNumber) => {
  const config = {
    headers: {
      email: localStorage.getItem("email"),
    },
  };
  return axioss.get(`/po/${poNumber}`, config);
};

export {
  fecthAll,
  notify,
  loginApi,
  postCreateUser,
  loginAdmin,
  role,
  getUserAdmin,
  sendOTP,
  verifyAPI,
  deleteUser,
  updateUser,
  resetPassword,
  getUserByEmail,
  getAllProduct,
  searchProduct,
  createPo,
  getPo,
  updatePo,
  fecthAllPoDetail,
  getAllPoDetail,
  updateProduct,
  addProduct,
  searchPODetail,
  updatePoDetail,
  showStatistical,
};
