import Layout from "../../../views/layout";
import LayoutEmpty from "../../../views/layoutEmpty";
import LayoutFull from "../../../views/layoutFull/";
const importComp = require("../../_import_comp");

// vv语音
export default {
  path: "/vvVoice",
  name: "vvVoice",
  component: Layout,
  redirect: "/vvVoice/vvDaily/index",
  alwaysShow: true,
  meta: {
    auth: true,
    title: "VV语音",
    icon: "vvDaily",
    roles: ["admin", "boss", "leader", "seoer"]
  },
  children: [
    {
      path: "vvDaily",
      name: "vvVoiceDaily",
      component: importComp("vvVoice/vvDaily/index"),
      meta: {
        auth: true,
        title: "VV日报",
        noCache: true,
        roles: ["admin", "boss", "leader", "seoer"],
        checkAdmin: true
      }
    },
    {
      path: "vvDaily/liveConsumptionData/index",
      name: "vvVoiceliveConsumptionData",
      component: importComp("vvVoice/liveConsumptionData/index"),
      meta: {
        auth: true,
        title: "直播消费数据",
        noCache: true,
        roles: ["admin", "boss", "leader", "seoer"],
        checkAdmin: true
      }
    },
    {
      path: "vvDaily/liveStatement",
      name: "vvVoiceLiveStatement",
      component: importComp("vvVoice/liveConsumptionData/liveStatement"),
      hidden: true,
      meta: {
        auth: true,
        title: "直播消费明细",
        noCache: true,
        crumbHidden: true,
        roles: ["admin", "boss", "leader", "seoer"]
      }
    },
    {
      path: "vvDaily/voiceRoom",
      name: "vvVoiceVoiceRoom",
      component: importComp("vvVoice/liveConsumptionData/voiceRoom"),
      hidden: true,
      meta: {
        auth: true,
        title: "语音房消费明细",
        noCache: true,
        crumbHidden: true,
        roles: ["admin", "boss", "leader", "seoer"]
      }
    },
    // {
    //   path: 'petConsumptionData',
    //   name: 'vvVoicepetConsumptionData',
    //   component: importComp('vvVoice/petConsumptionData'),
    //   meta: {
    //     auth: true,
    //     title: '宠物消费数据',
    //     noCache: true,
    //     roles: ['admin', 'boss'],
    //   },
    // },
    {
      path: "vvDaily/index",
      name: "vvVoicevipAddServiceIndex",
      component: importComp("vvVoice/vipAddService/index"),
      meta: {
        auth: true,
        title: "VIP增值服务",
        noCache: true,
        crumbHidden: true,
        roles: ["admin", "boss", "leader", "seoer"],
        checkAdmin: true
      }
    },
    {
      path: "vvDaily/VIPstatement",
      name: "vvVoiceVIPstatement",
      component: importComp("vvVoice/vipAddService/VIPstatement"),
      hidden: true,
      meta: {
        auth: true,
        title: "增值服务明细",
        noCache: true,
        crumbHidden: true,
        roles: ["admin", "boss", "leader", "seoer"]
      }
    },
    {
      path: "userAccountData",
      name: "vvVoiceuserAccountData",
      component: importComp("vvVoice/userAccountData"),
      meta: {
        auth: true,
        title: "用户账号数据",
        noCache: true,
        roles: ["admin", "boss"]
      }
    },
    {
      path: "userBehaviorData",
      name: "vvVoiceuserBehaviorData",
      component: importComp("vvVoice/userBehaviorData"),
      meta: {
        auth: true,
        title: "用户行为数据",
        noCache: true,
        roles: ["admin", "boss"]
      }
    }
  ]
};
