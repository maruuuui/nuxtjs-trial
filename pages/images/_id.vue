<template>
  <div>
    <h1>Images posts</h1>
    {{imageData}}
    <ul>
      <li>{{imageData.image_name}}</li>
      <li>{{imageData.memo}}</li>
      <li>{{imageData.created_at}}</li>
      <li>{{imageData.updated_at}}</li>
    </ul>

    <n-link to="/images">modoru</n-link>
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
};
</script>
