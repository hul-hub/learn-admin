<template>
  <div>
    <div class="page-crumbs">
      <div class="crumbs">
        <breadcrumb />
      </div>
    </div>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <h3>子渠道信息</h3>
      </div>
      <div class="body">
        <div class="filters">
          <el-form :model="filters" ref="filters">
            <el-row :gutter="10">
              <el-col :xs="24" :sm="12" :md="12" :lg="10" :xl="10">
                <div class="merge">
                  我的推广ID：
                  <el-input
                    @keyup.enter.native="submitFilter"
                    v-model="filters.queryValue"
                    placeholder="输入查询ID"
                  />
                </div>
                <div class="mesg">
                  <p>
                    <span>推广步骤：</span
                    >第一步：打开微信扫一扫，扫描小程序码进入小呈现
                  </p>
                  <p class="mesgp2">
                    第二步：按指引输入推广ID，即可获得推广海报，开始推广小程序游戏
                  </p>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </el-card>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <h3>获取小程序推广码</h3>
      </div>
      <div>
        <el-row
          :span="8"
          v-for="(o, index) in 2"
          :key="o"
          :offset="index > 0 ? 2 : 0"
        >
          <el-col>
            <el-card :body-style="{ padding: '0px' }" shadow="hover">
              <div class="titmes">
                <h3 class="titmesh3">宠物萌萌消</h3>
              </div>
              <div class="contenmes">
                <div style="width: 312px;height: 177px;border: 1px solid"></div>
                <div style="padding: 14px; width: 740px">
                  <h3>
                    眼疾手快大考验，高付费点，高留存率，推广业绩猛涨的法宝！
                  </h3>
                  <span
                    >风物承古韵，笔墨述千年。《梦幻西游》手游“梦幻国风节”自启动以来一直得到了玩家的热烈反响，上周在梦幻西游2018国风盛典——“梦幻国风节”展示部分，《梦幻西游》手游制作人陈俊雄先生就为广大玩家抢鲜预告了全新的“风物志”玩法。</span
                  >
                </div>
                <div
                  style="width: 312px;display:flex;flex-direction:column;align-items: center"
                >
                  <div
                    style="width: 178px;height: 178px;border: 1px solid"
                  ></div>
                  <span>微信扫码输入推广ID后，获取该小程序推广海报</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="body">
        <!--<div class="table-footer">-->
        <!--<div class="actions">-->
        <!--</div>-->
        <!--<div class="pages" style="float:right">-->
        <!--<el-pagination-->
        <!--background-->
        <!--layout="prev, pager, next, total"-->
        <!--:current-page="dataPagination.pageNo"-->
        <!--:total="dataPagination.count"-->
        <!--@current-change=" "-->
        <!--&gt;-->
        <!--</el-pagination>-->
        <!--</div>-->
        <!--</div>-->
      </div>
    </el-card>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
export default {
  name: "catfunIndex",
  components: {
    Breadcrumb
  },
  data() {
    return {
      filters: {
        queryValue: ""
      },
      labelPosition: "right",
      form: {
        date: "",
        currentTime: [],
        channel: ""
      }
    };
  },
  created() {},
  methods: {
    handleQueryKeyChange(option) {},
    handleQueryZoneChange(option) {}
  }
};
</script>

<style lang="scss" scoped>
.action-button {
  color: #007fff;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
}

.merge {
  display: flex;
  align-items: center;

  .el-select {
    display: inline-block;
  }
  .el-input {
    flex: 1;
    display: inline-block;
  }
}

.flex-align-center {
  align-items: center;
}

.mesgp2 {
  padding-left: 70px;
}
.titmes {
  padding-left: 14px;
  padding-right: 14px;
}
.titmesh3 {
  padding: 5px;
  border-bottom: 1px solid #d7d7d7;
}
.contenmes {
  display: flex;
  justify-content: space-around;
  padding: 0 0 14px 0;
}
</style>
