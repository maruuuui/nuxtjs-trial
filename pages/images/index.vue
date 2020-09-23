<template>
  <div>
    <h1>Images images</h1>
    {{ totalRecords }}件
    <button @click="refresh(nextPageNumber)">{{ nextPageNumber }}</button>
    <!-- <n-link :to="`/images/?page=${nextPageNumber}`">次</n-link> -->

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
              :max-width="0.2*window_width"
              :max-height="0.2*window_height"
            />
          </td>
          <td>
            <n-link :to="`/images/${imageData.id}`">{{ imageData.image_name }}</n-link>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
const baseUrl = "http://localhost:8000/api/v1/image/";

export default {
  async asyncData({ error, app }) {
    // appの中の$axiosを使用
    app.$myInjectedFunction("test");
    const res = await app.$axios.get(`${baseUrl}?page=1`).catch((err) => {
      console.log(err);
      return err.response;
    });
    console.log(res);

    if (res.status !== 200) {
      const statusCode = "status" in res ? res.status : 500;

      error({ statusCode: statusCode });

      return;
    }

    const totalRecords = res.data.count;
    const nextPageUrl = res.data.next;
    console.log(nextPageUrl);
    const pageQueryStringIndex = nextPageUrl.indexOf("?page=");
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
  methods: {
    refresh(pageNum) {
      console.log(pageNum);
      //       const res = await $axios
      //   .get("http://localhost:8000/api/v1/image/?page=1")
      //   .catch((err) => {
      //     return err.response;
      //   });
    },
  },
};
</script>
