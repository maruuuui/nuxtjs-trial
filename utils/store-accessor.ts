import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";

import ImageRecords from "~/store/imageRecords";

let imageRecordsStore: ImageRecords;

/**
 * ストアを初期化する（型推論できるモジュールとして取得する）
 * @param store Vuex.Store
 */
function initializeStores(store: Store<any>): void {
  // Todos を型推論できるストアモジュール化
  imageRecordsStore = getModule(ImageRecords, store);
}

export { initializeStores, imageRecordsStore };
