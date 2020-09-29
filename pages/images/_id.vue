<template>
  <div>
    <h1>Images posts</h1>
    <v-card>
      <v-img :src="imageRecord.image" contain height="200px"></v-img>

      <v-list two-line>
        <v-list-item key="image_name">
          <v-list-item-content>
            <v-list-item-title>image_name</v-list-item-title>
            <v-list-item-subtitle class="wrap-text">
              {{ imageRecord.image_name }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="`image_name_divider`"></v-divider>

        <v-list-item key="memo">
          <v-list-item-content>
            <v-list-item-title>memo</v-list-item-title>
            <v-list-item-subtitle class="wrap-text">
              {{ imageRecord.memo }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="`memo_divider`"></v-divider>

        <v-list-item key="created_at">
          <v-list-item-content>
            <v-list-item-title>created_at</v-list-item-title>
            <v-list-item-subtitle class="wrap-text">
              {{ imageRecord.created_at }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="`created_at_divider`"></v-divider>

        <v-list-item key="updated_at">
          <v-list-item-content>
            <v-list-item-title>updated_at</v-list-item-title>
            <v-list-item-subtitle class="wrap-text">
              {{ imageRecord.updated_at }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="`updated_at_divider`"></v-divider>
      </v-list>
    </v-card>
    <v-btn v-on:click="handleBackButtonClick">戻る</v-btn>
  </div>
</template>

<script>
// TODO:baseURLをどこかで設定してそれを読み込むよう変更
const baseUrl = "http://localhost:8000/api/v1/image/";

export default {
  mounted() {
    console.log(this.$route.params.id);
  },
  async asyncData({ error, app, params }) {
    const recordId = params.id;
    const url = `${baseUrl}${recordId}}`;

    const res = await app.$getImageRecord(url);
    if (!("data" in res)) {
      // エラーページの表示;
      console.log(res);
      const statusCode = res.status;
      const message = "message" in res ? res.message : "";
      error({ statusCode, message });
      return;
    } else {
      const imageRecord = res.data;
      console.log(imageRecord);
      return { imageRecord };
    }
  },

  head: {
    title: "Image Detail page",
  },
  methods: {
    handleBackButtonClick() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
/* v-list内の要素が折り返し表示されるよう設定するCSS */
.wrap-text {
  word-wrap: break-word;
  white-space: normal;
}
</style>