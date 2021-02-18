import Vue from "vue";

Vue.directive("loadMore", (el, binding) => {
  const selectWrap = el.querySelector(".el-table__body-wrapper");
  selectWrap.addEventListener("scroll", function() {
    const sign = 30;
    const scrollDistance =
      this.scrollHeight - this.scrollTop - this.clientHeight;
    if (scrollDistance !== 0 && scrollDistance <= sign) {
      binding.value();
    }
  });
});
