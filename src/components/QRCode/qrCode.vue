<template>
  <div qrcode>
    <img :src="url" />
  </div>
</template>

<script>
import QRCode from "qrcode";

export default {
  props: {
    text: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      url: ""
    };
  },
  async mounted() {
    try {
      this.url = await QRCode.toDataURL(
        window.location.origin + window.location.pathname + this.text
      );
    } catch (e) {
      console.error(e);
    }
  }
};
</script>

<style lang="scss">
[qrcode] {
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
