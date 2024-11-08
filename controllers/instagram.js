import { extractInstaId } from "../utils/url.js";
import getMetaInfo from "../service/meta.js";
import downloadContent from "../service/download.js";
import { filterInstaMetaInfo } from "../service/filter.js";
import sanitizeFilename from "../utils/sanitize-filename.js";
import injectHeaders from "../utils/headers.js";

async function getInstaMeta(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(500).json({
      status: "error",
      error: "URL not found",
      message: "",
      data: {},
    });
  }

  const contentId = extractInstaId(url);

  try {

    const metaInfo = await getMetaInfo("instagram", url);
    //first args is platform name
    const filteredMetaInfo = await filterInstaMetaInfo(metaInfo);

    return res.status(200).json({
      status: "success",
      message: "Successfully fetched content information",
      error: "",
      data: filteredMetaInfo,
    });
  } catch (error) {
    console.error("Error:", error);

    return res.status(500).json({
      status: "error",
      error: "Failed to fetch meta info",
      message: error.message,
      data: {},
    });
  }
}

async function downloadInstaContent(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(500).json({
      status: "error",
      error: "URL not found",
      message: "",
      data: {},
    });
  }

  try {
    const contentId = await extractInstaId(url);
    let meta;
    /*function to get meta info in download functionality so that if someone invoked download function meta data is available*/
    if (meta == null || meta == undefined) {
      const metaInfo = await getMetaInfo("instagram", url);
      //first args is platform name
      const filteredMetaInfo = await filterInstaMetaInfo(metaInfo);
      meta = filteredMetaInfo;
    }

    const filename = `RapidTube - ${meta.info.filename}`;

    const encodedFilename = encodeURIComponent(sanitizeFilename(filename));

    injectHeaders(res, encodedFilename, "video/mp4", null);

    const contentData = await downloadContent("instagram", url, null, res);
  } catch (error) {
    console.log("Error in downloadInstaContent", error);
    return res.status(500).json({
      status: "error",
      error: "Failed to download",
      message: error,
      data: {},
    });
  }
}

export { getInstaMeta, downloadInstaContent };
