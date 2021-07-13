const puppeteer = require("puppeteer");
const helper = require("../helper/common_insta");
const { QueryTypes } = require("sequelize");
const Sequelize = require("sequelize");
const db = require("../models");
const accountinfo = require("../models").insta_userdata;
const userpost = require("../models").insta_userposts;
let result;

exports.instaAccount = async (req, res) => {
  //setup
  try {
    if (req.headers && req.headers.filters) {
      let filters = JSON.parse(req.headers.filters);
      searchAccount =
        filters.search_field && filters.search_field != ""
          ? filters.search_field
          : "hello";
      numberOfPost = filters.limit && filters.limit != "" ? filters.limit : 10;
      searchType =
        filters.search_type && filters.search_type != ""
          ? filters.search_type
          : "insta_account";
      min_likes =
        filters.min_likes && filters.min_likes != "" ? filters.min_likes : "";
      min_comments =
        filters.min_comments && filters.min_comments != ""
          ? filters.min_comments
          : "";
      const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: ["--no-sandbox", "--start-maximized"],
      });
      const page = await browser.newPage();

      let loginRes = await helper.instaLogin(page);
      if (loginRes) {
        await helper.searchAccount(page, searchAccount);
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

let scrapeInfo = async (page, numOfPost, type) => {
  //debugger;
  result = [
    {
      general_data: {},
      post_data2: [],
    },
  ];
  if (type == "insta_account") {
    //data scraping

    let res = await getPostInfo(page, numOfPost);
    let queries = "SELECT * FROM `insta_userposts` where 1";

    queries += ' and  `username`="' + searchAccount + '"';
    if (min_comments != "") {
      queries += " and `comment`>=" + min_comments;
    }

    if (min_likes != "") {
      queries += " and `post_like`>=" + min_likes;
    }

    if (numOfPost != "") {
      queries += " limit " + numberOfPost;
    }

    console.log("queries", queries);
    //debugger;
    let postdata = await db.sequelize.query(queries, {
      type: QueryTypes.SELECT,
    });
    result[0].post_data = postdata;
    return result;
  } else {
    return result;
  }
};

let getPostInfo = async (page, numOfTopPost) => {
  //debugger;
  //data scraping
  let x = {};
  let totalpost_xpath =
    '//*[@id="react-root"]/section/main/div/header/section/ul/li[1]/span/span';
  let followers_xpath =
    '//*[@id="react-root"]/section/main/div/header/section/ul/li[2]/a/span';
  let following_xpath =
    '//*[@id="react-root"]/section/main/div/header/section/ul/li[3]/a/span';
  let profilename_xpath =
    '//*[@id="react-root"]/section/main/div/header/section/div[2]/h1';
  let username_xpath =
    '//*[@id="react-root"]/section/main/div/header/section/div[1]/h2';
  let bio_xpath =
    '//*[@id="react-root"]/section/main/div/header/section/div[2]/span';
  let profilepic_xpath =
    '//*[@id="react-root"]/section/main/div/header/div/div/span/img';
  x.profile_name = await helper.getValueFromXpath(page, username_xpath);
  x.profilepic = await helper.getSrcFromXpath(page, profilepic_xpath);
  x.user_name = await helper.getValueFromXpath(page, profilename_xpath);
  x.bio = await helper.getValueFromXpath(page, bio_xpath);
  x.total_post = await helper.getValueFromXpath(page, totalpost_xpath);
  x.followers = await helper.getValueFromXpath(page, followers_xpath);
  x.following = await helper.getValueFromXpath(page, following_xpath);
  // Profile data
  accountinfo.create(x);
  result[0].general_data = x;

  return await getPostdata(page, numOfTopPost, x.user_name);
};
let getPostdata = async (page, numOfTopPost, username) => {
  //debugger;
  const xpath_posts = '//article//div[@class="v1Nh3 kIKUG  _bz0w"]';
  await page.waitForXPath(xpath_posts);
  let list = await page.$x(xpath_posts);
  let end_len = list.length;
  if (list.length > numOfTopPost) {
    end_len = numOfTopPost;
  }
  console.log("endlen", end_len);
  let start = result[0].post_data2.length > 0 ? result.length - 1 : 0;

  for (let index = start; index < end_len - 1; index++) {
    let y = {};
    let indx = index + 1;
    let post_id_xpath =
      '(//article//div[@class="v1Nh3 kIKUG  _bz0w"])[' + indx + "]/a";
    y.username = username;
    y.post_id = await helper.getHrefFromXpath(page, post_id_xpath);
    const elements = await page.$x(
      '//article//div[@class="v1Nh3 kIKUG  _bz0w"]'
    );
    await elements[index].click();
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
      y.post_like = y.post_like.replace(/,/g, "");
      y.post_view = "";
    } catch {
      y.post_content_img = "";
      try {
        await page.waitForXPath(post_content_vid_xpath);
        y.post_content_video = await helper.getSrcFromXpath(
          page,
          post_content_vid_xpath
        );
        y.post_like = "";
      } catch {
        y.post_content_video = "";
      }
      try {
        await page.waitForXPath(post_video_view_xpath);
        y.post_view = await helper.getValueFromXpath(
          page,
          post_video_view_xpath
        );
      } catch {
        y.post_view = "";
      }
    }
    await page.waitForXPath(post_caption_xpath);
    y.post_caption = await helper.getValueFromXpath(page, post_caption_xpath);

    const Close = await page.$x(post_close_path);
    await Close[0].click();
    userpost.create(y);
    result[0].post_data2.push(y);
  }
  console.log(
    "result.length < numOfPost",
    result[0].post_data2.length,
    numOfTopPost
  );
  if (result[0].post_data2.length < numOfTopPost) {
    await helper.pageScrollTillCount(page, numOfTopPost);
    await page.waitForTimeout(5000);
    let list_new = await helper.getList(page, xpath_posts);
    if (list_new.length > list.length) {
      await getPostdata(page, numOfTopPost, username);
    } else {
      return result;
    }
  }
  return result;
};
