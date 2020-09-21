import moment from "moment";

export function getPageParam(pagination, sorter) {
  console.log(sorter)
  const param = {}
  if (sorter && sorter.field) {
    param.sort = sorter.field + "," + (sorter.order === "ascend" ? "asc" : "desc")
  }
  param.page = pagination.current - 1
  param.size = pagination.pageSize
  return param
}

export function tranStartTime(time) {
  return moment(time).format('YYYY-MM-DD') + ' 00:00:00'
}


export function tranEndTime(time) {
  return moment(time).format('YYYY-MM-DD') + ' 23:59:59'
}


export function tranSearchTime(times) {

  var tem = []
  if (times && times[0]) {
    tem.push(tranStartTime(times[0]))
  }
  if (times && times[1]) {
    tem.push(tranStartTime(times[1]))
  }
  return tem;
}

export function getUrlParam(name, str) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = str.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
}
