<template>
  <div>
    <el-card
      class="box-card"
      shadow="never"
      v-if="isShowGuildConsumeMoney == 1"
    >
      <div slot="header" class="clearfix">
        <h3>玩家消费总额</h3>
        <el-tooltip class="item ml10" effect="dark" placement="top">
          <div slot="content">不含玩家购买平台币的数据</div>
          <i class="el-icon-question"></i>
        </el-tooltip>
      </div>
      <div class="body">
        <div class="grids-data">
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content">
                <h3>今日总额（元）</h3>
                <p>{{ consume.today | toThousandslsFilter }}</p>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content">
                <h3>昨日总额（元）</h3>
                <p>{{ consume.yesterday | toThousandslsFilter }}</p>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content">
                <h3>本月总额（元）</h3>
                <p>{{ consume.thisMonth | toThousandslsFilter }}</p>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content data-content-last">
                <h3>上月总额（元）</h3>
                <p>{{ consume.lastMonth | toThousandslsFilter }}</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <h3>推广数据</h3>
      </div>
      <div class="body">
        <div class="grids-data">
          <el-row>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content">
                <h3>今日注册数 / 创角数</h3>
                <p>{{ spread.register.today }} / {{ spread.role.today }}</p>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content">
                <h3>昨日注册数 / 创角数</h3>
                <p>
                  {{ spread.register.yesterday }} / {{ spread.role.yesterday }}
                </p>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content">
                <h3>本月注册数 / 创角数</h3>
                <p>
                  {{ spread.register.thisMonth }} / {{ spread.role.thisMonth }}
                </p>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content data-content-last">
                <h3>上月注册数 / 创角数</h3>
                <p>
                  {{ spread.register.lastMonth }} / {{ spread.role.lastMonth }}
                </p>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>

    <!-- 隐藏VV相关 -->
    <el-card class="box-card" shadow="never" v-if="false">
      <div slot="header" class="clearfix">
        <h3>直播收入</h3>
      </div>
      <div class="body">
        <div class="grids-data">
          <el-row>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content">
                <h3>今日收入（元）</h3>
                <p>{{ live.today }}</p>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content">
                <h3>昨日收入（元）</h3>
                <p>{{ live.yesterday }}</p>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content">
                <h3>本月收入（元）</h3>
                <p>{{ live.thisMonth }}</p>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content data-content-last">
                <h3>上月收入（元）</h3>
                <p>{{ live.lastMonth }}</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAnalysis } from "@/api/dashboard";

export default {
  name: "dashboardEditor",
  data() {
    return {
      isShowGuildConsumeMoney: "",
      // 玩家消费总额
      consume: {
        today: 0,
        yesterday: 0,
        thisMonth: 0,
        lastMonth: 0
      },
      // 推广数据
      spread: {
        register: {
          today: 0,
          yesterday: 0,
          thisMonth: 0,
          lastMonth: 0
        },
        role: {
          today: 0,
          yesterday: 0,
          thisMonth: 0,
          lastMonth: 0
        }
      },
      // 直播
      live: {
        today: 0,
        yesterday: 0,
        thisMonth: 0,
        lastMonth: 0
      }
    };
  },
  created() {
    this.getAnalysis();
    this.isShowGuildConsumeMoney = JSON.parse(
      window.sessionStorage.getItem("Admin-Account-Union")
    ).isShowGuildConsumeMoney;
  },
  methods: {
    async getAnalysis() {
      console.log("获取统计信息...");
      try {
        const res = await getAnalysis();
        if (res.state === "fail") {
          this.$message.error(res.message || "数据分析加载失败，请刷新重试");
        } else if (res.state === "ok") {
          // 玩家消费总额
          this.consume.today = res.data.todayConsume;
          this.consume.yesterday = res.data.yesterdayComsume;
          this.consume.thisMonth = res.data.thisMonthComsume;
          this.consume.lastMonth = res.data.lastMonthComsume;
          // 推广数据 - 注册
          this.spread.register.today = res.data.todayUser;
          this.spread.register.yesterday = res.data.yesterdayUser;
          this.spread.register.thisMonth = res.data.thisMonthUser;
          this.spread.register.lastMonth = res.data.lastMonthUser;
          // 推广数据 - 创角数
          this.spread.role.today = res.data.todayRole;
          this.spread.role.yesterday = res.data.yesterdayRole;
          this.spread.role.thisMonth = res.data.thisMonthRole;
          this.spread.role.lastMonth = res.data.lastMonthRole;
          // 直播收入
          this.live.today = res.data.todayLiveIncome;
          this.live.yesterday = res.data.lastDayLiveIncome;
          this.live.thisMonth = res.data.thisMonthLiveIncome;
          this.live.lastMonth = res.data.lastMonehtLiveIncome;
        }
      } catch (error) {
        console.log("getAnalysis error", error);
        this.$message.error("数据分析加载失败，请刷新重试");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.grids-data {
  .data-content {
    text-align: center;
    border-right: 1px solid #e0e0e0;
    padding: 15px 5px;
    margin: 5px 0;

    h3 {
      margin: 0;
      padding: 0;
      font-size: 14px;
      font-weight: 400;
      opacity: 0.8;
      margin-bottom: 15px;
    }
    p {
      margin: 0;
      padding: 0;
      font-size: 26px;
      font-weight: 400;
    }
  }

  .el-row {
    .el-col:last-child {
      .data-content {
        border-right: 0;
      }
    }
  }
}

@media only screen and (min-width: 992px) {
  .grids-data {
    .el-row {
      .el-col:nth-of-type(4n + 4) {
        .data-content {
          border-right: 0;
        }
      }
    }
  }
}

@media only screen and (min-width: 768px) {
  .grids-data {
    .el-row {
      .el-col:nth-of-type(4n + 2),
      .el-col:nth-of-type(4n + 4) {
        .data-content {
          border-right: 0;
        }
      }
    }
  }
}

@media only screen and (max-width: 768px) {
  .grids-data {
    .el-row {
      .el-col {
        .data-content {
          border-right: 0;
        }
      }
    }
  }
}
</style>
