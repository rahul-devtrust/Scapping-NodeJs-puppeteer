const puppeteer = require("puppeteer");
const helper = require("../helper/common_insta");
const hashtag = require("../models").insta_hashtag;

let result;

exports.instahashtag = async (req, res) => {
  //setup
  try {
    console.log(JSON.parse(req.headers.filters));
    if (req.headers && req.headers.filters) {
      let filters = JSON.parse(req.headers.filters);
      search_text =
        filters.search_field && filters.search_field != ""
          ? filters.search_field
          : "#artfornotsale";
      numberOfPost = filters.limit && filters.limit != "" ? filters.limit : 10;
      searchType =
        filters.search_type && filters.search_type != ""
          ? filters.search_type
          : "insta_hashtag";
      min_likes =
        filters.min_likes && filters.min_likes != "" ? filters.min_likes : "";
      // min_comments = (filters.min_comments && filters.min_comments!='')?filters.min_comments:'';

      //const browser = await puppeteer.launch({headless:true,defaultViewport: null, args: ['--no-sandbox','--start-maximized']});
      const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"],
      });

      const page = await browser.newPage();
      let loginRes = await helper.instaLogin(page);
      if (loginRes) {
        // search_field = "#" + search_field;
        await helper.searchHashTag(page, search_text);
        let result_ = await scrapeInfo(page, numberOfPost, searchType);
        console.log("result", result.length, result);
        await browser.close();
        res.send({
          error: false,
          errorMsg: "",
          result: result_,
        });
      } else {
        await browser.close();
        res.send({
          error: true,
          errorMsg: "Provided details are not working",
          result: [],
        });
      }
    } else {
      res.send({
        error: true,
        errorMsg: "No filter applied",
        result: [],
      });
    }
  } catch (error) {
    console.log("error", error);
    res.send({
      error: true,
      errorMsg: "error",
      result: [],
    });
  }
};
let scrapeInfo = async (page, numOfTopPost, type) => {
  //debugger;
  result = [
    {
      info: [],
      post_data: [],
    },
  ];
  if (type == "insta_hashtag") {
    //data scraping

    let res = await getPostInfo(page, numOfTopPost);
    return result;
  } else {
    return result;
  }
};
let getPostInfo = async (page, numOfTopPost) => {
  let x = {};
  let TotalPosts = await page.$eval(".g47SY", (node) => node.innerHTML);
  x.TotalPosts = TotalPosts;
  result[0].info.push(x);
  return await getPostdata(page, numOfTopPost);
};
let getPostdata = async (page, numOfTopPost) => {
  //debugger;
  const xpath_posts = '//article//div[@class="v1Nh3 kIKUG  _bz0w"]';
  await page.waitForXPath(xpath_posts);
  let list = await page.$x(xpath_posts);
  let end_len = list.length;
  if (list.length > numOfTopPost) {
    end_len = numOfTopPost;
  }
  console.log("endlen", end_len);
  let start = result[0].post_data.length > 0 ? result.length - 1 : 0;

  for (let index = start; index < end_len - 1; index++) {
    let y = {};
    let indx = index + 1;
    let post_id_xpath =
      '(//article//div[@class="v1Nh3 kIKUG  _bz0w"])[' + indx + "]/a";
    y.post_id = await helper.getHrefFromXpath(page, post_id_xpath);
    const elements = await page.$x(
      '//article//div[@class="v1Nh3 kIKUG  _bz0w"]'
    );
    await elements[index].click();
    let post_account_name_xpath = '//article//div[@class="e1e1d"]/span/a';
    let post_caption_xpath =
      "//article/div[3]/div[1]/ul/div/li/div/div/div[2]/span";
    let post_content_xpath =
      '//div[@role="dialog"]//article//img[@class="FFVAD"]';
    let post_content_vid_xpath = "//article//video";
    let post_close_path =
      '//div[@class="                     Igw0E     IwRSH      eGOV_         _4EzTm                                                                                  BI4qX            qJPeX            fm1AK   TxciK yiMZG"]';
    let post_like_path = '//div[@class="Nm9Fw"]/a/span';
    let post_video_view_xpath = "//article/div[3]/section[2]/div/span";

    try {
      await page.waitForXPath(post_content_xpath);
      y.post_content_img = await helper.getSrcFromXpath(
        page,
        post_content_xpath
      );
      y.post_like = await helper.getValueFromXpath(page, post_like_path);
      y.post_view = "";
    } catch {
      y.post_content_img = "";
      await page.waitForXPath(post_content_vid_xpath);
      y.post_content_video = await helper.getSrcFromXpath(
        page,
        post_content_vid_xpath
      );
      y.post_like = "";
      await page.waitForXPath(post_video_view_xpath);
      y.post_view = await helper.getValueFromXpath(page, post_video_view_xpath);
    }

    await page.waitForXPath(post_account_name_xpath);
    y.post_acc_name = await helper.getValueFromXpath(
      page,
      post_account_name_xpath
    );
    await page.waitForXPath(post_caption_xpath);
    y.post_caption = await helper.getValueFromXpath(page, post_caption_xpath);
    const Close = await page.$x(post_close_path);
    await Close[0].click();
    hashtag.create(y);
    result[0].post_data.push(y);
  }
  console.log(
    "result.length < numOfPost",
    result[0].post_data.length,
    numOfTopPost
  );
  if (result[0].post_data.length < numOfTopPost) {
    await helper.pageScrollTillCount(page, numOfTopPost);
    await page.waitForTimeout(5000);
    let list_new = await helper.getList(page, xpath_posts);
    if (list_new.length > list.length) {
      await getPostdata(page, numOfTopPost);
    } else {
      return result;
    }
  }
  return result;
};
