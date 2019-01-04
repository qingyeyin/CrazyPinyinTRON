// @material-ui/icons
import Games from "@material-ui/icons/Games";
// core components/views
import VideoAds from "views/VideoAds/VideoAds.jsx";

const dashboardRoutes = [
  {
    path: "/",
    sidebarName: "疯狂拼音",
    navbarName: "数据面板",
    icon: Games,
    component: VideoAds
  },
  { redirect: true, path: "/", to: "/", navbarName: "数据面板" }
];

export default dashboardRoutes;
