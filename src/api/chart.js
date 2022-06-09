import qs from "qs";
import request from "@/api/request";
// ##订单更新
export const putOrdersApi = (putData) => {
  return request({
    url: "/orders/update.jsp",
    method: "put",
    data: qs.stringify(putData),
  });
};
// ##订单统计
export const getTotalApi = (params) => {
  return request({
    url: "/orders/total.jsp",
    method: "get",
    params,
  });
};
