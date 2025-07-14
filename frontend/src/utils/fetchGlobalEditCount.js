import axios from "axios";

const xtoolsProjects = [
  "an.wikipedia.org",
  "as.wikipedia.org",
  "awa.wikipedia.org",
  "bh.wikipedia.org",
  "bho.wikipedia.org",
  "bn.wikipedia.org",
  "bo.wikipedia.org",
  "commons.wikimedia.org",
  "de.wikipedia.org",
  "en.wikibooks.org",
  "en.wikipedia.org",
  "en.wiktionary.org",
  "gom.wiktionary.org",
  "gu.wikipedia.org",
  "gu.wikisource.org",
  "hi.wikibooks.org",
  "hi.wikipedia.org",
  "hi.wikiversity.org",
  "hi.wikiquote.org",
  "hif.wikipedia.org",
  "hif.wiktionary.org",
  "id.wikipedia.org",
  "ja.wikipedia.org",
  "kn.wikipedia.org",
  "ks.wikipedia.org",
  "mai.wikipedia.org",
  "mediawiki.org",
  "meta.wikimedia.org",
  "ml.wikipedia.org",
  "mni.wikipedia.org",
  "mr.wikipedia.org",
  "ms.wikipedia.org",
  "ne.wikipedia.org",
  "new.wikipedia.org",
  "or.wikipedia.org",
  "outreach.wikimedia.org",
  "pa.wikipedia.org",
  "pnb.wikipedia.org",
  "pt.wikipedia.org",
  "ru.wikipedia.org",
  "sa.wikipedia.org",
  "sat.wikipedia.org",
  "simple.wikipedia.org",
  "ta.wikipedia.org",
  "te.wikipedia.org",
  "ur.wikipedia.org",
  "wikidata.org",
  "wikimania.wikimedia.org",
  "www.wikidata.org"
  
];

export async function fetchGlobalEditCount(username) {
  const cleanUsername = username.trim().replace(/ /g, "_");

  const requests = xtoolsProjects.map(async (project) => {
    const url = `https://xtools.wmcloud.org/api/user/automated_editcount/${project}/${cleanUsername}`;

    try {
      const res = await axios.get(url);
      return res.data.total_editcount || 0;
    } catch (err) {
      console.warn(`❌ Failed for ${project}`, err.message);
      return 0;
    }
  });

  const results = await Promise.all(requests);
  const totalGlobalEdits = results.reduce((sum, count) => sum + count, 0);

  return {
    total: totalGlobalEdits,
    breakdown: results.map((count, i) => ({
      project: xtoolsProjects[i],
      count,
    })),
  };
}
