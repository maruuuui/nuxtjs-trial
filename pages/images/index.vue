<template>
  <div>
    <h1>Images</h1>
    {{ totalRecords }}件
    <n-link :to="{ path: `/images/?page=${nextPageNumber}` }">次</n-link>

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
    const nowPage = route.query.page ? route.query.page : 1;
    // console.log(nowPage);
    // appの中の$axiosを使用
    const res = await app.$axios
      .get(`${baseUrl}?page=${nowPage}`)
      .catch((err) => {
        console.log(err);
        return err.response;
      });
    console.log(res);

    if (res.status !== 200) {
      const statusCode = "status" in res ? res.status : 500;

      error({ statusCode: statusCode });

      return;
    }

    const totalRecords = res.data.count; // 総レコード数
    const nextPageUrl = res.data.next; // 次のページのレコードを取得するためのURL
    console.log(nextPageUrl);
    // 次のレコードが何ページ目かを取得
    const pageQueryStringIndex =
      nextPageUrl !== null ? nextPageUrl.indexOf("?page=") : -1;
    const nextPageNumber =
      pageQueryStringIndex === -1
        ? undefined
        : nextPageUrl.slice(pageQueryStringIndex + 6);
    return {
      images: res.data.results,
      totalRecords,
      nextPageNumber,
    };
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
