<template>
  <div>
    <h1>Images</h1>
    <h2>保存された画像：{{ totalRecords }}件</h2>
    <v-btn @click="getApi(0)">更新</v-btn>
    {{ imageRecords }}
    <div class="align-center">
      <!-- 前ページへのリンクボタン ここから -->
      <v-btn v-if="disablePrevButton == true" disabled key="prevbtn-disabled">
        &lt;
      </v-btn>
      <v-btn v-else key="prevbtn-enabled">&lt;</v-btn>
      <!-- 前ページへのリンクボタン ここまで -->

      {{ nowPageNumber }}ページ目

      <!-- 次ページへのリンクボタン ここから -->
      <v-btn v-if="disableNextButton == true" disabled key="nextbtn-disabled">
        &gt;
      </v-btn>
      <v-btn v-else key="nextbtn-enabled">&gt;</v-btn>
      <!-- 次ページへのリンクボタン ここまで -->
    </div>
  </div>
</template>

<script  lang="ts">
import { Context } from "@nuxt/types";
// import { NuxtError, NuxtAppOptions, Route } from "@nuxt/types";
import { ImageRecord } from "~/models/ImageRecord";
import { imageRecordsStore } from "~/store";

const baseUrl =
  process.env.NUXT_ENV_BASE_URL || "http://localhost:8000/api/v1/image/";

export default {
  data: function () {
    return { disablePrevButton: true, disableNextButton: true };
  },
  computed: {
    window_width() {
      return window.innerWidth; // 画面幅
    },
    window_height() {
      return window.innerHeight; // 画面幅
    },
    imageRecords() {
      // リスト（imageRecords）を取得
      return imageRecordsStore.imageRecords;
    },
    totalRecords() {
      return imageRecordsStore.totalRecords;
    },
    prevPageNumber() {
      return imageRecordsStore.prevPageNumber;
    },
    nowPageNumber() {
      return imageRecordsStore.nowPageNumber;
    },
    nextPageNumber() {
      return imageRecordsStore.nextPageNumber;
    },
  },

  head: {
    title: "Images page",
  },
  methods: {
    getApi(pageNumber: number) {
      console.log(pageNumber);
      imageRecordsStore
        .fetchNewImageRecords(baseUrl, pageNumber)
        .then(
          (response) => {
            alert(`"ok beforeCreate: ", ${response}`);
          },
          (error) => {
            alert(`"no beforeCreate: ", ${error}`);
          }
        )
        .finally(() => {
          //   this.chk();
        });
    },
  },
  watch: {
    // ボタンの状態を切り替えるため値の変化を監視する
    prevPageNumber(val: number) {
      console.log("watch prevPageNumber", val);
      //   this.$set(this.disablePrevButton, val < 1);
      //   this.disablePrevButton = val < 1;
    },
    nextPageNumber(val: number) {
      console.log("watch nextPageNumber", val);
      //   this.disableNextButton = val < 2;
    },
  },
};
</script>

<style>
/* 子要素を中央ぞろえにするCSS */
.align-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>