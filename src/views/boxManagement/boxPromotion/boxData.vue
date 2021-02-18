<template>
  <div>
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
    </div>
    <el-card class="box-card" shadow="never">
      <div slot="header">
        <span style="color: #000; font-size: 18px">盒子用户数</span>
      </div>
      <div class="body">
        <div class="grids-data">
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content">
                <h3>今天登录数/注册数</h3>
                <p>
                  {{ spread.register.todayLoginNum }} /
                  {{ spread.register.todayRegisterNum }}
                </p>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content">
                <h3>昨天登录数/注册数</h3>
                <p>
                  {{ spread.register.yesterdayLoginNum }} /
                  {{ spread.register.yesterdayRegisterNum }}
                </p>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content">
                <h3>本月登录数/注册数</h3>
                <p>
                  {{ spread.register.monthLoginNum }} /
                  {{ spread.register.monthRegisterNum }}
                </p>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content data-content-last">
                <h3>上月登录数/注册数</h3>
                <p>
                  {{ spread.register.lastMonthLoginNum }} /
                  {{ spread.register.lastMonthRegisterNum }}
                </p>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
    <!-- <el-card class="box-card" shadow="never">
      <div slot="header">
        <span style="color: #000; font-size: 18px">盒子游戏用户数</span>
      </div>
      <div class="body">
        <div class="grids-data">
          <el-row>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content">
                <h3>今天登录数/注册数</h3>
                <p>{{ spread.register.today }}</p>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content">
                <h3>昨天登录数/注册数</h3>
                <p>
                  {{ spread.register.yesterday }}
                </p>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content">
                <h3>本月登录数/注册数</h3>
                <p>
                  {{ spread.register.thisMonth }}
                </p>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content data-content-last">
                <h3>上月登录数/注册数</h3>
                <p>
                  {{ spread.register.lastMonth }}
                </p>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
    <el-card class="box-card" shadow="never">
      <div slot="header">
        <span style="color: #000; font-size: 18px">盒子用户付费金额</span>
      </div>
      <div class="body">
        <div class="grids-data">
          <el-row>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content">
                <h3>今天总额（元）</h3>
                <p>{{ spread.register.today }}</p>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content">
                <h3>昨天总额（元）</h3>
                <p>
                  {{ spread.register.yesterday }}
                </p>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content">
                <h3>本月总额（元）</h3>
                <p>
                  {{ spread.register.thisMonth }}
                </p>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
              <div class="data-content data-content-last">
                <h3>上月总额（元）</h3>
                <p>
                  {{ spread.register.lastMonth }}
                </p>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card> -->
  </div>
</template>

<script>
// import { getAnalysis } from "@/api/dashboard";
import http from "@/utils/http";
import Breadcrumb from "@/components/Breadcrumb";
export default {
  name: "boxData",
  components: {
    Breadcrumb
  },
  data() {
    return {
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
          todayLoginNum: 0,
          todayRegisterNum: 0,
          yesterdayLoginNum: 0,
          yesterdayRegisterNum: 0,
          monthLoginNum: 0,
          monthRegisterNum: 0,
          lastMonthLoginNum: 0,
          lastMonthRegisterNum: 0
        }
      }
    };
  },
  created() {
    this.getAnalysis();
  },
  methods: {
    async getAnalysis() {
      try {
        const res = await http.get2("/guild/boxData.do");
        if (res.state === "fail") {
          this.$message.error(res.message || "数据加载失败，请刷新重试");
        } else if (res.state === "ok") {
          // 盒子用户数
          this.spread.register = { ...res.data };
        }
      } catch (error) {
        this.$message.error("数据加载失败，请刷新重试");
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
