// @material-ui/icons
import Games from "@material-ui/icons/Games";
// core components/views
import VideoAds from "views/VideoAds/VideoAds.jsx";

const dashboardRoutes = [
  {
    path: "/user",
    sidebarName: "疯狂拼音",
    navbarName: "数据面板",
    icon: Games,
    component: VideoAds
  },
  { redirect: true, path: "/", to: "/user", navbarName: "Redirect" }
];

export default dashboardRoutes;
