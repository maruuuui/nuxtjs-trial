import axios from "axios";
import { NuxtError } from "@nuxt/types/app";

const myInjectedFunction = async (
  url: string,
  errorCallback: (params: NuxtError) => void
) => {
  console.log("url:", url);
  let res
  try {
    res = await axios.get(url)
  } catch (err) {
    console.log(err);
    if (!err.response) {
      //no response => レスポンスすら受け取れない場合。ステータスコードは定義されていない
      errorCallback({ statusCode: undefined, message: "network error" })
      return;
    }
    // 各レスポンスに対応する処理があれば追加
    errorCallback({ statusCode: err.response.status, message: "server error" });
    return;
  }

  console.log(res);

  if (res.status !== 200) {
    const statusCode = "status" in res ? res.status : 500;
    errorCallback({ statusCode: statusCode });
    return;
  }
};

export default ({ }, inject: any) => {
  inject("myInjectedFunction", myInjectedFunction);
};
