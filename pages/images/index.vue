<template>
  <div>
    <h1>Images</h1>
    <h2>保存された画像：{{ totalRecords }}件</h2>

    <v-simple-table>
      <thead>
        <tr>
          <th class="text-left">img</th>
          <th class="text-left">file name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="imageData of images" :key="imageData.id">
          <td>
            <v-img
              :src="imageData.image"
              contain
              :max-width="0.2 * window_width"
              :max-height="0.2 * window_height"
            />
          </td>
          <td>
            <n-link :to="`/images/${imageData.id}`">{{
              imageData.image_name
            }}</n-link>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
    <div class="align-center">
      <!-- 前ページへのリンクボタン ここから -->
      <p
        :to="{ path: `/images/?page=${prevPageNumber}` }"
        class="button--disabled"
        v-if="prevPageNumber === undefined"
      >
        &lt;
      </p>
      <n-link
        :to="{ path: `/images/?page=${prevPageNumber}` }"
        class="button--green"
        v-else
        >&lt;</n-link
      >
      <!-- 前ページへのリンクボタン ここまで -->

      {{ nowPageNumber }}ページ目

      <!-- 次ページへのリンクボタン ここから -->
      <p
        :to="{ path: `/images/?page=${nextPageNumber}` }"
        class="button--disabled"
        v-if="nextPageNumber === undefined"
      >
        &gt;
      </p>
      <n-link
        :to="{ path: `/images/?page=${nextPageNumber}` }"
        class="button--green"
        v-else
        >&gt;</n-link
      >
      <!-- 次ページへのリンクボタン ここまで -->
    </div>
  </div>
</template>

<script>
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
      console.log(nextPageUrl);
      // 次のレコード取得用URLがAPIから取得できたらページ数
      if (nextPageUrl === null) {
        // 次のレコード取得用URLがnull => 現在位置が最終ページ
        return {
          images: res.data.results,
          totalRecords,
          prevPageNumber,
          nowPageNumber,
          nextPageNumber: undefined,
        };
      }
      const pageQueryStringIndex = nextPageUrl.indexOf("?page=");
      const nextPageNumber = nextPageUrl.slice(pageQueryStringIndex + 6);
      return {
        images: res.data.results,
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