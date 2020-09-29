import axios, { AxiosResponse } from "axios";
import { Plugin } from "@nuxt/types";

//プラグインの注入先のための型定義
// https://typescript.nuxtjs.org/cookbook/plugins.html

declare module "vue/types/vue" {
  interface Vue {
    $getImageRecords(
      url: string
    ): Promise<AxiosResponse<ImageApiResponse> | AxiosErrorStatus>;
  }
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $getImageRecords(
      url: string
    ): Promise<AxiosResponse<ImageApiResponse> | AxiosErrorStatus>;
  }
}

declare module "vuex/types/index" {
  interface Store<S> {
    $getImageRecords(
      url: string
    ): Promise<AxiosResponse<ImageApiResponse> | AxiosErrorStatus>;
  }
}
//プラグインの注入先のための型定義ここまで

// axiosによるリクエスト時にエラーが発生した場合に返すオブジェクトの型定義
type AxiosErrorStatus = {
  status: number;
  message: string;
  errorResponse: AxiosResponse<any>;
};

// 期待するAPIからのレスポンス形式
type ImageApiResponse = {
  count: number;
  next: string | null;
  previous: string;
  results: ImageRecord[];
};

type ImageRecord = {
  created_at: string;
  id: string;
  image: string;
  image_name: string;
  memo: string;
  updated_at: string;
};
const getImageRecords = async (
  url: string
): Promise<AxiosResponse<ImageApiResponse> | AxiosErrorStatus> => {
  console.log("url:", url);

  const res = await axios.get(url).catch(err => {
    console.log(err);
    if (!err.response) {
      // レスポンスすら受け取れない場合。ステータスコードは定義されていない
      return { status: -1, message: "network error", errorResponse: null };
    }
    console.log("エラーレスポンス", err.response);
    const status = err.response.status;
    if (status >= 500) {
      // サーバ側の問題
      let serverErrorMessage = "server error";
      // 各レスポンスに対応する処理があれば追加

      return {
        status: err.response.status,
        message: serverErrorMessage,
        errorResponse: err.response
      };
    }
    if (status < 500 && status >= 400) {
      // クライアント側の問題
      let clientErrorMessage;
      if (status === 404) {
        clientErrorMessage = "存在しないページです";
      }
      clientErrorMessage = "client error";
      // 各レスポンスに対応する処理があれば追加
      return {
        status: err.response.status,
        message: clientErrorMessage,
        errorResponse: err.response
      };
    }

    // これら以外によるエラー時の処理
    return {
      status: err.response.status,
      message: "error",
      errorResponse: err.response
    };
  });

  // 正常なレスポンス
  console.log(res);

  return res;
};

const axiosPlugin: Plugin = (context, inject) => {
  inject("getImageRecords", getImageRecords);
};

export default axiosPlugin;
