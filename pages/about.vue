<template>
  <div>
    <h1>Blog posts</h1>

    <li v-for="post of posts" :key="post.id">
      <!-- <p>{{ post.memo }}</p> -->
      <n-link :to="`/posts/${post.id}`">{{ post.memo }}</n-link>
    </li>
  </div>
</template>

<script>
export default {
  async asyncData({ app: { $axios } }) {
    const data = await $axios.get(`http://localhost:8000/api/v1/image/`); // appの中の$axiosを使用
    console.log(data);
    return { posts: data.data.results };
  },

  head: {
    title: "About page",
  },
};
</script>
