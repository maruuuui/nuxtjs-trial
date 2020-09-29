<template>
  <div>
    <h1>Images posts</h1>
    <v-card>
      <v-img :src="imageData.image" contain height="200px"></v-img>

      <v-list two-line>
        <v-list-item key="image_name">
          <v-list-item-content>
            <v-list-item-title>image_name</v-list-item-title>
            <v-list-item-subtitle class="wrap-text">
              {{ imageData.image_name }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="`image_name_divider`"></v-divider>

        <v-list-item key="memo">
          <v-list-item-content>
            <v-list-item-title>memo</v-list-item-title>
            <v-list-item-subtitle class="wrap-text">
              {{ imageData.memo }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="`memo_divider`"></v-divider>

        <v-list-item key="created_at">
          <v-list-item-content>
            <v-list-item-title>created_at</v-list-item-title>
            <v-list-item-subtitle class="wrap-text">
              {{ imageData.created_at }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="`created_at_divider`"></v-divider>

        <v-list-item key="updated_at">
          <v-list-item-content>
            <v-list-item-title>updated_at</v-list-item-title>
            <v-list-item-subtitle class="wrap-text">
              {{ imageData.updated_at }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="`updated_at_divider`"></v-divider>
      </v-list>
    </v-card>
    <v-btn v-on:click="modoru">戻る</v-btn>
  </div>
</template>

<script>
export default {
  mounted() {
    console.log(this.$route.params.id);
  },
  async asyncData({ app: { $axios }, params }) {
    const data = await $axios.get(
      `http://localhost:8000/api/v1/image/${params.id}`
    ); // appの中の$axiosを使用
    console.log(data);
    return { imageData: data.data };
  },

  head: {
    title: "Image Detail page",
  },
  methods: {
    modoru() {
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