import axios from "axios";
import { NuxtError } from "@nuxt/types/app";

const myInjectedFunction = async (
  url: string,
  errorCallback: (params: NuxtError) => void
) => {
  console.log("url:", url);
  const res = await axios.get(url).catch(err => {
    console.log(err);
    if (!err.response) {
      //no response => network error
      return "network error";
    }
    return err.response;
  });
  console.log(res);

  if (res.status !== 200) {
    const statusCode = "status" in res ? res.status : 500;
    errorCallback({ statusCode: statusCode });
    return;
  }
};

export default ({}, inject: any) => {
  inject("myInjectedFunction", myInjectedFunction);
};
