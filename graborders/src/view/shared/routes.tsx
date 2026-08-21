
import Permissions from "src/security/permissions";
const permissions = Permissions.values;

const privateRoutes = [
  {
    path: "/",
    loader: () => import("src/view/pages/Markets/Home"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },
  {
    path: "/vip",
    loader: () => import("src/view/pages/Vip/Vip"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },
  {
    path: "/vip-select",
    loader: () => import("src/view/pages/Vip/VipSelect"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },
  {
    path: "/Order",
    loader: () => import("src/view/pages/Order/Order"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },
  {
    path: "/search",
    loader: () => import("src/view/pages/Search/Search"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },
  {
    path: "/grap",
    loader: () => import("src/view/pages/Grap/GrapPage"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },


  {
    path: "/profile",
    loader: () => import("src/view/pages/Auth/Profile"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },
];

const screenRoutes = [
  {
    path: "/currency",
    loader: () => import("src/view/pages/Currency/CurrecnyPage"),
    permissionRequired: permissions.categoryRead,
  },

  {
    path: "/events",
    loader: () => import("src/view/pages/Events/Events"),
    permissionRequired: permissions.categoryRead,
  },
  {
    path: "/invitation",
    loader: () => import("src/view/pages/Invitation/Invitation"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },
  {
    path: "/company",
    loader: () => import("src/view/pages/Company/Company"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },
  {
    path: "/faqs",
    loader: () => import("src/view/pages/Faqs/Faqs"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },
  {
    path: "/tc",
    loader: () => import("src/view/pages/T&C/Tc"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },
  {
    path: "/cooperation",
    loader: () => import("src/view/pages/Cooperation/Cooperation"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },
  {
    path: "/Online",
    loader: () => import("src/view/pages/Online/Online"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },


  {
    path: "/LiveChat",
    loader: () => import("src/view/pages/Online/Livechat"),
  },
  {
    path: "/Certificate",
    loader: () => import("src/view/pages/Certificate/Certificate"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },

  {
    path: "/tasks",
    loader: () => import("src/view/pages/Tasks/Tasks"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },
  {
    path: "/myprofile",
    loader: () => import("src/view/pages/Team/Team"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },
  {
    path: "/team",
    loader: () => import("src/view/pages/Team/TeamNetwork"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },
  {
    path: "/team/:id",
    loader: () => import("src/view/pages/Team/TeamNetwork"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },
  {
    path: "/withdraw",
    loader: () => import("src/view/pages/withdraw/Withdraw"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },
  {
    path: "/deposit",
    loader: () => import("src/view/pages/Deposit/Deposit"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },
  {
    path: "/security",
    loader: () => import("src/view/pages/Auth/ChangePassword"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },
  {
    path: "/transacation",
    loader: () => import("src/view/pages/Transactions/Transaction"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },
  {
    path: "/wallet",
    loader: () => import("src/view/pages/wallet/Wallet"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },


  {
    path: "/notifications",
    loader: () => import("src/view/pages/notification/Notification"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },

  {
    path: "/languages",
    loader: () => import("src/view/pages/language/Language"),
    permissionRequired: permissions.categoryRead,
    exact: true,
  },



];
const publicRoutes = [
  {
    path: "/auth/signin",
    loader: () => import("src/view/pages/Auth/Signin"),
  },
  {
    path: "/auth/signup",
    loader: () => import("src/view/pages/Auth/Signup"),
  },
  {
    path: "/impersonate",
    loader: () => import("src/view/pages/Auth/ImpersonatePage"),
  },

    {
    path: "/Chat",
    loader: () => import("src/view/pages/Online/Livechat"),
  },
];
const simpleRoutes = [
  {
    path: "/403",
    loader: () => import("src/view/shared/errors/Error403Page"),
  },
  {
    path: "/500",
    loader: () => import("src/view/shared/errors/Error500Page"),
  },
  {
    path: "**",
    loader: () => import("src/view/shared/errors/Error404Page"),
  },
].filter(Boolean);

const emptyPermissionsRoutes = [
  {
    path: "/auth/empty-permissions",
    loader: () => import("src/view/pages/Auth/EmptyPermissionsPage"),
  },
].filter(Boolean);
export default {
  privateRoutes,
  publicRoutes,
  simpleRoutes,
  screenRoutes,
  emptyPermissionsRoutes,
};
