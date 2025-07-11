import axios from "axios";

export async function fetchFirstEdit(project, username) {
  const url = `https://${project}/w/api.php?action=query&list=usercontribs&ucuser=${username}&uclimit=1&ucdir=newer&format=json&origin=*`;
  const res = await axios.get(url);
  const contribs = res.data.query.usercontribs;
  return contribs.length > 0 ? contribs[0].timestamp : null;
}