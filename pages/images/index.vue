<template>
  <div>
    <h1>Images</h1>
    <h2>保存された画像：{{ totalRecords }}件</h2>

    <v-simple-table>
      <thead>
        <tr>
          <th class="text-left">画像</th>
          <th class="text-left">ファイル名</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="imageRecord of imageRecords" :key="imageRecord.id">
          <td>
            <v-img
              :src="imageRecord.image"
              contain
              :max-width="0.2 * window_width"
              :max-height="0.2 * window_height"
            />
          </td>
          <td>
            <n-link :to="`/images/${imageRecord.id}`">{{
              imageRecord.image_name
            }}</n-link>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
    <div class="align-center">
      <!-- 前ページへのリンクボタン ここから -->
      <v-btn
        :to="{ path: `/images/?page=${prevPageNumber}` }"
        v-if="prevPageNumber === undefined"
        disabled
        nuxt
      >
        &lt;
      </v-btn>
      <v-btn :to="{ path: `/images/?page=${prevPageNumber}` }" v-else nuxt
        >&lt;</v-btn
      >
      <!-- 前ページへのリンクボタン ここまで -->

      {{ nowPageNumber }}ページ目

      <!-- 次ページへのリンクボタン ここから -->
      <v-btn
        :to="{ path: `/images/?page=${nextPageNumber}` }"
        v-if="nextPageNumber === undefined"
        disabled
        nuxt
      >
        &gt;
      </v-btn>
      <v-btn :to="{ path: `/images/?page=${nextPageNumber}` }" v-else nuxt
        >&gt;</v-btn
      >
      <!-- 次ページへのリンクボタン ここまで -->
    </div>
  </div>
</template>

<script>
// TODO:baseURLをどこかで設定してそれを読み込むよう変更
const baseUrl = "http://localhost:8000/api/v1/image/";

export default {
  // クエリパラメータの監視設定
  // パスが変わらずクエリパラメータだけが変わった際にも再描画を行わせる
  watchQuery: ["page"],
  //描画処理
  async asyncData({ error, app, route }) {
    // ?page=XX のXXの値を取得
    const nowPageNumber = route.query.page ? route.query.page : 1;
    const prevPageNumber = nowPageNumber == 1 ? undefined : nowPageNumber - 1;

    const url = `${baseUrl}?page=${nowPageNumber}`;
    const res = await app.$getImageRecords(url);

    if (!("data" in res)) {
      // エラーページの表示;
      console.log(res);
      const statusCode = res.status;
      const message = "message" in res ? res.message : "";
      error({ statusCode, message });
      return;
    } else {
      const totalRecords = res.data.count; // 総レコード数
      const nextPageUrl = res.data.next; // 次のページのレコードを取得するためのURL
      const imageRecords = res.data.results; // 現在ページのレコード
      console.log(nextPageUrl);
      // 次のレコード取得用URLがAPIから取得できたらページ数
      if (nextPageUrl === null) {
        // 次のレコード取得用URLがnull => 現在位置が最終ページ
        return {
          imageRecords,
          totalRecords,
          prevPageNumber,
          nowPageNumber,
          nextPageNumber: undefined,
        };
      }
      const pageQueryStringIndex = nextPageUrl.indexOf("?page=");
      const nextPageNumber = nextPageUrl.slice(pageQueryStringIndex + 6);
      return {
        imageRecords,
        totalRecords,
        prevPageNumber,
        nowPageNumber,
        nextPageNumber,
      };
    }
  },
  computed: {
    window_width() {
      return window.innerWidth; // 画面幅
    },
    window_height() {
      return window.innerHeight; // 画面幅
    },
  },

  head: {
    title: "Images page",
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