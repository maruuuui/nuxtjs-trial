import axios, { AxiosResponse, AxiosError } from "axios";
import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { ImageRecord } from "~/models/ImageRecord";

// stateFactory: true → Vuex をモジュールモードで扱うために指定
@Module({ stateFactory: true, namespaced: true, name: "imageRecords" })
export default class ImageRecords extends VuexModule {
  imageRecords: ImageRecord[] = [];
  totalRecords: number = 0;
  prevPageNumber: number | undefined = -1;
  nowPageNumber: number = 1;
  nextPageNumber: number | undefined = -1;

  @Mutation
  setImageRecords(newRecords: ImageRecord[]) {
    // リストに ImageRecord を追加
    this.imageRecords = newRecords;
  }
  @Mutation
  setPrevPageNumber(pageNumber: number) {
    this.prevPageNumber = pageNumber;
  }
  @Mutation
  setNowPageNumber(pageNumber: number) {
    this.nowPageNumber = pageNumber;
  }
  @Mutation
  setNextPageNumber(pageNumber: number) {
    console.log("setNextPageNumber");

    this.nextPageNumber = pageNumber;
  }
  @Mutation
  setCount(count: number) {
    this.totalRecords = count;
  }

  @Action({ rawError: true })
  async fetchNewImageRecords(baseUrl: string, pageNumber: number) {
    console.log(pageNumber);

    const url = `${baseUrl}?page=${pageNumber}`;
    const res = await axios.get(url).catch(err => {
      return _formatAxiosError(err);
    });
    if (!("data" in res)) {
      // 失敗時
      console.log(res);
      this.context.commit("setImageRecords", []);
      // javascriptではPythonと違い任意のオブジェクトで例外を送出できる
      // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/throw
      // これを利用し失敗の詳細を呼び出し元に伝える
      throw res;
    } else {
      //   成功時
      console.log(res);
      const count = res.data.count;
      this.context.commit("setCount", count);
      const nextPageUrl = res.data.next; // 次のページのレコードを取得するためのURL
      const imageRecords = res.data.results; // 現在ページのレコード
      const prevPageNumber =
        this.nowPageNumber == 1 ? undefined : this.nowPageNumber - 1;
      this.context.commit("setPrevPageNumber", prevPageNumber);

      if (nextPageUrl === null) {
        // 次のレコード取得用URLがnull => 現在位置が最終ページ
        this.context.commit("setNextPageNumber", undefined);
      } else {
        const pageQueryStringIndex = nextPageUrl.indexOf("?page=");
        const nextPageNumber = parseInt(
          nextPageUrl.slice(pageQueryStringIndex + 6)
        );
        console.log(`nextPageNumber:${nextPageNumber}`);
        this.context.commit("setNextPageNumber", nextPageNumber);
      }

      this.context.commit("setImageRecords", imageRecords);
      return "ok";
    }
  }
}

// axiosによるリクエスト時にエラーが発生した場合に返すオブジェクトの型定義
type AxiosErrorStatus = {
  status: number;
  message: string;
  errorResponse: AxiosResponse<any> | null;
};

// axios通信時に発生したエラーを扱う関数
const _formatAxiosError = (err: AxiosError): AxiosErrorStatus => {
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
    } else {
      clientErrorMessage = "client error";
    }
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
};
