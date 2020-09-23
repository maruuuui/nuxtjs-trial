// https://typescript.nuxtjs.org/cookbook/plugins.html#iii-combined-inject

import { Plugin } from "@nuxt/types";

declare module "vue/types/vue" {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $myInjectedFunction(message: string): void;
  }
}

declare module "@nuxt/types" {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $myInjectedFunction(message: string): void;
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $myInjectedFunction(message: string): void;
  }
}

declare module "vuex/types/index" {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $myInjectedFunction(message: string): void;
  }
}

const myPlugin: Plugin = (context, inject) => {
  inject("myInjectedFunction", (message: string) => console.log(message));
};

export default myPlugin;
