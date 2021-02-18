import member from "./modules/member";
import datas from "./modules/datas";
import dataSearch from "./modules/dataSearch";
import gameManage from "./modules/gameManage";
import aid from "./modules/aid";
import giveFirstCharge from "./modules/giveFirstCharge";
import vvVoice from "./modules/vvVoice";
import personal from "./modules/personal";
import tools from "./modules/tools";
import catfun from "./modules/catfun";
import finance from "./modules/finance";
import recoveryBox from "./modules/recoveryBox";
import guildData from "./modules/guildData";
import noticeBoard from "./modules/noticeBoard";
import playerWelfare from "./modules/playerWelfare";
import boxManagement from "./modules/boxManagement";
import boxManagementdetails from "./modules/boxManagementdetails";

let routes = [
  boxManagement,
  boxManagementdetails,
  member,
  datas,
  dataSearch,
  gameManage,
  aid,
  giveFirstCharge,
  // vvVoice,
  finance,
  tools,
  personal,
  noticeBoard,
  playerWelfare
  // guildData
  // catfun,
  // recoveryBox,
];

const routes_666wyx = [member, datas, dataSearch, gameManage, aid, personal];
// if (process.env.VUE_APP_PLATFORM === "newPlatform") {
//   routes.forEach(item => {
//     if (item.name == "personal") {
//       delete item.children[3];
//     }
//   });
// }

export default routes;
