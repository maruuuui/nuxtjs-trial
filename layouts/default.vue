<template>
  <div>
    <v-toolbar id="header">
      <v-toolbar-title>Nuxt.js Trial</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" nuxt>Top Page</v-btn>
      <v-btn :to="{ path: '/images/?page=1' }" nuxt>Images Page</v-btn>
    </v-toolbar>
    <nuxt :nuxt-child-key="$route.fullPath" />
  </div>
</template>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

h1 {
  color: green;
}

h2 {
  color: green;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--disabled {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #b1b1b1;
  background-color: #b1b1b1;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
