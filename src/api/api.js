import axios from "axios";

export function getSmartCityInfo() {
  return axios.get("https://apifoxmock.com/m1/5207153-4873334-default/api/smartcity/info");
}
export function getSmartCityList(){
  return axios.get("https://apifoxmock.com/m1/5207153-4873334-default/api/smartcity/list");
}