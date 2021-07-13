const puppeteer = require('puppeteer');
const scrollDown = require('puppeteer-autoscroll-down');
const { QueryTypes } = require('sequelize');
const Sequelize = require('sequelize');
const moment = require('moment');
const helper = require('../helper/common');
const db = require('../models')
const Posts = require('../models').Posts;
const Pages = require('../models').Pages;
const Groups = require('../models').Groups;
const Events = require('../models').Events;
const People = require('../models').people;
const { min } = require('moment');
const fs = require('fs');


const base_hashtag_xpath = "//div[@role='feed']/div/div";
const post_username_xpath = "//div[@class='j83agx80']/div[2]//h2//span/a[1]/span"
const hashTag_group_name_xpath = "//div[@class='j83agx80']/div[2]//h2//span/a[2]/span";
const hashtag_like_xpath = "//span[@class='pcp91wgn']";
const hastag_comment_xpath = "//div[@class='n1l5q3vz bp9cbjyn m9osqain j83agx80 jq4qci2q a3bd9o3v enqfppq2']//div[@class='pfnyh3mw']";
const hashtag_content_xpath = "//span[@class='a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7']";
const hashtag_postImgUrl_xpath = "//div[contains(@class,'aph9nnby')]//img";
const hashtag_group_user_id_xpath = "//div[@class='j83agx80']/div[2]//h2//span/a[1]";
const hashtag_post_fbid_xpath = "//a[@class='oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 a8c37x1j p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl gmql0nx0 p8dawk7l']";
const hashtag_post_verified_xpath = "//span['hrs1iv20 pq6dq46d']";
//page
const page_icon_xpath = '//div[@class="hybvsw6c cjfnh4rs j83agx80 cbu4d94t dp1hu0rb l9j0dhe7 be9z9djy o36gj0jk jyyn76af aip8ia32 so2p5rfc hxa2dpaq"]//div[@class="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 aahdfvyu tvmbv18p"][2]/div[7]/a';
const base_page_xpath = "//div[@role='feed']/div/div";
const page_pagename_xpath = "//span[@class='nc684nl6']/a/span";
const page_link_xpath = "//span[@class='nc684nl6']/a";
const page_like_followers_xpath = "//div//span[@class='a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5 ojkyduve']";
///const page_des_xpath = "//div[@class='jktsbyx5']";
const page_des_xpath = "//span[contains(@class,'a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7')]";
const page_image_xpath = "//*[name()='svg']//*[name()='image']";
const page_verified_xpath = "//span['hrs1iv20 pq6dq46d']";

//Event
const event_button_xpath = '//div[@class="hybvsw6c cjfnh4rs j83agx80 cbu4d94t dp1hu0rb l9j0dhe7 be9z9djy o36gj0jk jyyn76af aip8ia32 so2p5rfc hxa2dpaq"]//div[@class="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 aahdfvyu tvmbv18p"][2]/div[10]/a';
const event_base_xpath = "//div[@role='feed']/div/div";
const event_icon_xpath = "//a/div/img";
const event_id_xpath = "//a[@class='oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl gmql0nx0 gpro0wi8']";
const event_name_xpath = "//span[@class='nc684nl6']";
const event_date_xpath = "//span[@class='a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5']";
const event_other_details = "//span[contains(@class,'d2edcug0 hpfvmrgz qv66sw1b c1et5uql')]";

//group
const group_button_xpath = '//div[@class="hybvsw6c cjfnh4rs j83agx80 cbu4d94t dp1hu0rb l9j0dhe7 be9z9djy o36gj0jk jyyn76af aip8ia32 so2p5rfc hxa2dpaq"]//div[@class="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 aahdfvyu tvmbv18p"][2]/div[9]/a';
const group_base_xpath = "//div[@role='feed']/div/div";
const group_icon_xpath = "//a/div/img";
const group_id_xpath = "//a[@class='oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl gmql0nx0 gpro0wi8']";
const group_name_xpath = "//span[@class='nc684nl6']";
const group_other_values_xpath = "//div[@class='jktsbyx5']"
const group_type_members_xpath = "//span[contains(@class,'a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5')]"

//people
const people_button_xpath = '//div[@class="hybvsw6c cjfnh4rs j83agx80 cbu4d94t dp1hu0rb l9j0dhe7 be9z9djy o36gj0jk jyyn76af aip8ia32 so2p5rfc hxa2dpaq"]//div[@class="rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 aahdfvyu tvmbv18p"][2]/div[3]/a';
const people_base_xpath = "//div[@role='feed']/div/div";
const people_icon_xpath = "//*[name()='svg']//*[name()='image']";
const people_name_xpath = "//span[@class='nc684nl6']";
const people_other_info_xpath = "//div[@class='qzhwtbm6 knvmm38d'][2]";
const people_id_xpath = "//span[@class='nc684nl6']/a";
const check_for_other_info_xpath = "//div[@class='qzhwtbm6 knvmm38d']";
const other_info_xpath = "//span[contains(@class,'d2edcug0 hpfvmrgz qv66sw1b c1et5uql')]";

//comments

let result;
let searchText;
let searchType;
let numberOfPost;
let year;
let min_likes;
let min_comments;

exports.fbKeyWord = async (req, res) => {

  try {
    // //setup
    if (req.headers && req.headers.filters) {
      let filters = JSON.parse(req.headers.filters);
      searchText = (filters.search_text && filters.search_text != '') ? filters.search_text : 'hollywood';
      numberOfPost = (filters.limit && filters.limit != '') ? filters.limit : 10;
      searchType = (filters.search_type && filters.search_type != '') ? filters.search_type : 'post';
      year = (filters.year && filters.year != '') ? filters.year : '';
      min_likes = (filters.min_likes && filters.min_likes != '') ? filters.min_likes : '';
      min_comments = (filters.min_comments && filters.min_comments != '') ? filters.min_comments : '';

      //'--no-sandbox',
      const browser = await puppeteer.launch({ headless: true, defaultViewport: null, args: ['--no-sandbox', '--start-maximized'] });
      const page = await browser.newPage();
      let loginRes = await helper.fbLogin(page);
      if (loginRes) {
        if (searchType != 'comment') {
          await helper.searchHashTag(page, searchText);
        }

        let result_ = await scrapeInfo(page, numberOfPost, searchType, filters);
        await browser.close();
        res.send({
          error: false,
          errorMsg: '',
          result: result_
        });

      } else {
        await browser.close();
        res.send({
          error: true,
          errorMsg: 'Provided details are not working',
          result: []
        });
      }

    } else {
      res.send({
        error: true,
        errorMsg: 'No filter applied',
        result: []
      });
    }

  } catch (error) {
    res.send({
      error: true,
      errorMsg: 'error',
      result: []
    });
  }
}

let scrapeInfo = async (page, numOfPost, type, filters) => {

  result = [];
  if (type == 'page') {

    //click on page button
    await page.waitForXPath(page_icon_xpath);
    const elements = await page.$x(page_icon_xpath);
    await elements[0].click();
    await page.waitForTimeout(10000);

    //data scraping
    await helper.pageScrollTillCount(page, numOfPost);
    return await getPageInfo(page, numOfPost);

  } else if (type == 'post') {
    //click on post button
    await page.waitForXPath('//div[@class="ow4ym5g4 auili1gw rq0escxv j83agx80 buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 nnctdnn4 hpfvmrgz qt6c0cv9 jb3vyjys l9j0dhe7 du4w35lb bp9cbjyn btwxx1t3 dflh9lhu scb9dxdr"]//span[text()="Posts"]');
    const elements = await page.$x('//div[@class="ow4ym5g4 auili1gw rq0escxv j83agx80 buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 nnctdnn4 hpfvmrgz qt6c0cv9 jb3vyjys l9j0dhe7 du4w35lb bp9cbjyn btwxx1t3 dflh9lhu scb9dxdr"]//span[text()="Posts"]');
    await elements[0].click();
    await page.waitForTimeout(10000);

    //data scraping
    await helper.pageScrollTillCount(page, numOfPost);
    await getPostInfo(page, numOfPost);
    //query form db
    let queries = 'SELECT * FROM `Posts` where 1';

    queries += ' and `search_type`="' + searchType + '" and `search_text`="' + searchText + '"';
    if (min_comments != '') {
      queries += ' and `comment`>=' + min_comments;
    }

    if (min_likes != '') {
      queries += ' and `like`>=' + min_likes;
    }

    if (year != '') {
      queries += ' and YEAR(`post_date`)=' + year
    }

    if (numOfPost != '') {
      queries += ' limit ' + numOfPost;
    }

    return await db.sequelize.query(queries, { type: QueryTypes.SELECT });


  } else if (type == 'event') {

    //click on event button
    await page.waitForXPath(event_button_xpath);
    const elements = await page.$x(event_button_xpath);
    await elements[0].click();
    await page.waitForTimeout(10000);

    //event scraping
    await helper.pageScrollTillCount(page, numOfPost);
    return await getEventInfo(page, numOfPost);

  } else if (type == 'people') {

    //click on people icon    
    await page.waitForXPath(people_button_xpath);
    const elements = await page.$x(people_button_xpath);
    await elements[0].click();
    await page.waitForTimeout(10000);

    //people scraping
    await helper.pageScrollTillCount(page, numOfPost);
    return await getPeopleInfo(page, numOfPost);

    //people scraping
  } else if (type == 'group') {
    //click on group button
    await page.waitForXPath(group_button_xpath);
    const elements = await page.$x(group_button_xpath);
    await elements[0].click();
    await page.waitForTimeout(10000);

    //group scraping
    await helper.pageScrollTillCount(page, numOfPost);
    return await getGroupInfo(page, numOfPost);
  } else if (type == 'comment') {

    let page_url = searchText;
    //let comment_base_xpath = (filters.group_id!='')?'(//ul)[2]':'(//ul)[3]';
    let comment_base_xpath = "((//div[@class='cwj9ozl2 tvmbv18p'])[1])/ul"
    let limit = (filters.limit > 1000) ? 1000 : filters.limit;
    await page.goto(page_url, {
      waitUntil: ['load', 'networkidle2'],
      timeout: 20000,
    });

    return await getCommentsInfo(page, limit, comment_base_xpath);

  } else {
    return result;
  }
}

let getCommentsInfo = async (page, limit, comment_base_xpath) => {

  //data scraping
  let xpath_page = comment_base_xpath + '/li';
  await page.waitForXPath(xpath_page);
  let list = await page.$x(xpath_page);
  let end_len = (list.length > 1) ? list.length - 1 : list.length;
  if (list.length > limit) {
    end_len = limit - 1;
  }
  let start = (result.length > 0) ? result.length - 1 : 0

  for (let index = start; index < end_len; index++) {
    let x = {}

    let indx = index + 1;
    let comment_sender_xpath = xpath_page + "[" + indx + "]" + "//span[@class='pq6dq46d']";
    let comment_sender_img_xpath = xpath_page + "[" + indx + "]" + "//*[name()='image']";
    let comment_sender_comment_xpath = xpath_page + "[" + indx + "]" + "//div[@class='ecm0bbzt e5nlhep0 a8c37x1j']";
    let comment_img_xpath = xpath_page + "[" + indx + "]" + "//div[@class='i09qtzwb rq0escxv n7fi1qx3 pmk7jnqg j9ispegn kr520xx4']/a/img";

    x.commenter_name = await helper.getValueFromXpath(page, comment_sender_xpath);
    x.profile_pic = await helper.getSrcFromSVG(page, comment_sender_img_xpath, 'href');
    x.comment = '';
    x.comment_img = '';
    let search = '<div class="ecm0bbzt e5nlhep0 a8c37x1j">';
    let search_path = xpath_page + "[" + indx + "]";
    let isExist = await helper.getValueObjectFromXpath(page, search_path, search);
    if (isExist) {
      x.comment = await helper.getValueFromXpath(page, comment_sender_comment_xpath);
    }
    let search_ = '<div class="i09qtzwb rq0escxv n7fi1qx3 pmk7jnqg j9ispegn kr520xx4">';
    let isExist_img = await helper.getValueObjectFromXpath(page, search_path, search_);
    if (isExist_img) {
      x.comment_img = await helper.getSrcFromXpath(page, comment_img_xpath);
    }
    result.push(x);
  }

  if (result.length < limit) {

    await helper.pageScrollTillCount(page, limit);
    //await page.waitForTimeout(5000);
    try {
      const view_more_comments_xpath = comment_base_xpath + "/following-sibling::div//div[@role='button']";
      await page.waitForXPath(view_more_comments_xpath);
      const elements = await page.$x(view_more_comments_xpath);
      await elements[0].click();
      await page.waitForTimeout(10000);
      let list_new = await helper.getList(page, xpath_page);
      if (list_new.length > list.length) {
        await getCommentsInfo(page, limit, comment_base_xpath);
      } else {
        return result;
      }

    } catch (error) {
      return result;
    }
  }
  return result;
}

let getPeopleInfo = async (page, numOfPost) => {

  //data scraping
  const xpath_page = people_base_xpath;
  await page.waitForXPath(xpath_page);
  let list = await page.$x(xpath_page);
  let end_len = list.length;
  if (list.length > numOfPost) {
    end_len = numOfPost;
  }
  let start = (result.length > 0) ? result.length - 1 : 0

  for (let index = start; index < end_len - 1; index++) {
    let x = {}
    let indx = index + 1;
    let peopleName_xpath = event_base_xpath + "[" + indx + "]" + people_name_xpath;
    x.people_name = await helper.getValueFromXpath(page, peopleName_xpath);

    let peopleId_xpath = people_base_xpath + "[" + indx + "]" + people_id_xpath;
    x.people_link = await helper.getHrefFromXpath(page, peopleId_xpath, 'href');
    x.people_id = null;
    let people_id_href = x.people_link;
    if (people_id_href.includes('?id=')) {
      let arr_link = people_id_href.split('=');
      x.people_id = arr_link[arr_link.length - 1];
    } else {
      let arr_link = people_id_href.split('/');
      x.people_id = arr_link[arr_link.length - 1];
    }

    let people_img_xpath = people_base_xpath + "[" + indx + "]" + people_icon_xpath;
    x.img = await helper.getSrcFromSVG(page, people_img_xpath);
    x.people_other_info = null;
    x.lives_in = null;
    let people_other_information_check_xpath = people_base_xpath + "[" + indx + "]" + check_for_other_info_xpath;
    let people_other_info_count = await helper.getValueFromXpath(page, people_other_information_check_xpath, true);

    if (people_other_info_count.length > 1) {
      let people_other_information_xpath = people_base_xpath + "[" + indx + "]" + people_other_info_xpath;
      let search = '<span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql';
      let isExist = await helper.getValueObjectFromXpath(page, people_other_information_xpath, search);

      if (isExist) {
        let other_information = people_base_xpath + "[" + indx + "]" + other_info_xpath;
        let people_other_information = await helper.getValueFromXpath(page, other_information, true);

        people_other_information.map(row => {
          if (row.includes('Lives in')) {
            x.lives_in = row.replace("Lives in ", "");
          }
        })

        x.people_other_info = people_other_information.join('<br/>');
      }
    }
    People.create(x);
    result.push(x);
  }
  if (result.length < numOfPost) {
    await helper.pageScrollTillCount(page, numOfPost);
    await page.waitForTimeout(5000);
    let list_new = await helper.getList(page, people_base_xpath);
    if (list_new.length > list.length) {
      await getPeopleInfo(page, numOfPost);
    } else {
      return result;
    }
  }
  return result;
}

let getGroupInfo = async (page, numOfPost) => {

  //data scraping
  const xpath_page = group_base_xpath;
  await page.waitForXPath(xpath_page);
  let list = await page.$x(xpath_page);
  let end_len = list.length;
  if (list.length > numOfPost) {
    end_len = numOfPost;
  }

  let start = (result.length > 0) ? result.length - 1 : 0

  for (let index = start; index < end_len - 1; index++) {

    let x = {}
    let indx = index + 1;

    let groupName_xpath = group_base_xpath + "[" + indx + "]" + group_name_xpath;
    x.group_name = await helper.getValueFromXpath(page, groupName_xpath);

    let groupId_xpath = group_base_xpath + "[" + indx + "]" + group_id_xpath;
    x.link = await helper.getHrefFromXpath(page, groupId_xpath, 'href');
    x.group_id = null;
    if (x.link) {
      let arr = x.link;
      x.group_id = (arr.split('/'))[4];
    }

    //need to extract group Id 
    let group_img_xpath = group_base_xpath + "[" + indx + "]" + group_icon_xpath;
    x.img = await helper.getSrcFromXpath(page, group_img_xpath);

    let group_type_and_member = group_base_xpath + "[" + indx + "]" + group_type_members_xpath;
    let type_and_member = await helper.getValueFromXpath(page, group_type_and_member);
    x.type_and_member = type_and_member;
    //break in type and member
    let arr = (type_and_member.replace(/\s{2,}/g, ' ')).split(' ');
    x.group_type = null;
    x.members = null;
    let grpIndex = arr.indexOf('group');
    let memIndex = arr.indexOf('members');
    if (grpIndex != -1) {
      x.group_type = arr[grpIndex - 1];
    }
    if (memIndex != -1) {
      x.members = arr[memIndex - 1];
    }

    let group_other_info_xpath = group_base_xpath + "[" + indx + "]" + group_other_values_xpath;
    x.group_other_info = (await helper.getValueFromXpath(page, group_other_info_xpath, true)).join('<br/>');

    await Groups.create(x);
    result.push(x);
  }
  if (result.length < numOfPost) {
    await helper.pageScrollTillCount(page, numOfPost);
    let list_new = await helper.getList(page, group_base_xpath);
    if (list_new.length > list.length) {
      await getGroupInfo(page, numOfPost);
    } else {
      return result;
    }
  }
  return result;
}

let getEventInfo = async (page, numOfPost) => {

  //data scraping
  const xpath_page = event_base_xpath;
  await page.waitForXPath(xpath_page);
  let list = await page.$x(xpath_page);
  let end_len = list.length;
  if (list.length > numOfPost) {
    end_len = numOfPost;
  }
  let start = (result.length > 0) ? result.length - 1 : 0
  for (let index = start; index < end_len - 1; index++) {
    let x = {}
    let indx = index + 1;

    let eventName_xpath = event_base_xpath + "[" + indx + "]" + event_name_xpath;
    x.event_name = await helper.getValueFromXpath(page, eventName_xpath);

    let eventId_xpath = event_base_xpath + "[" + indx + "]" + event_id_xpath;
    let evt_id_link = await helper.getHrefFromXpath(page, eventId_xpath, 'href');

    x.event_link = evt_id_link;
    x.event_id = null;
    if (evt_id_link) {
      let link = (evt_id_link).split('/');
      let evnId_index = link.indexOf('events');
      if (evnId_index != -1) {
        x.event_id = link[evnId_index + 1];
      }
    }


    let event_other_xpath = event_base_xpath + "[" + indx + "]" + event_other_details;
    let event_description = await helper.getValueFromXpath(page, event_other_xpath);
    x.event_description = event_description;
    x.event_type = null;
    x.people_went = null;
    x.people_intrested = null;

    if (event_description) {
      let arr = (event_description.replace(/\s{2,}/g, ' ')).split(' ');
      if (arr[0] == 'Event') {
        x.event_type = arr[0];
      } else {
        let evt_ty_ind = arr.indexOf('event');
        if (evt_ty_ind != -1) {
          x.event_type = arr[evt_ty_ind - 1];
        }
      }

      let peo_went_ind = arr.indexOf('went');
      if (peo_went_ind != -1) {
        x.people_went = arr[peo_went_ind - 2];
      }

      let peo_intrested_ind = arr.indexOf('interested');
      if (peo_intrested_ind != -1) {
        x.people_intrested = arr[peo_intrested_ind - 2];
      }

    }


    let eventDate_xpath = event_base_xpath + "[" + indx + "]" + event_date_xpath;
    let evt_date = await helper.getValueFromXpath(page, eventDate_xpath);

    let new_date = moment(new Date(evt_date + ' ' + new Date().getFullYear())).format('YYYY-MM-DD');;
    x.event_date = (new_date != 'Invalid date') ? new_date : null;
    x.custom_date = evt_date;

    let event_img_xpath = event_base_xpath + "[" + indx + "]" + event_icon_xpath;
    x.img = await helper.getSrcFromXpath(page, event_img_xpath);
    await Events.create(x);
    result.push(x);
  }
  if (result.length < numOfPost) {
    await helper.pageScrollTillCount(page, numOfPost);
    await page.waitForTimeout(10000);
    let list_new = await helper.getList(page, event_base_xpath);
    if (list_new.length > list.length) {
      await getEventInfo(page, numOfPost);
    } else {
      return result;
    }

  }
  return result;
}


let getPageInfo = async (page, numOfPost) => {

  //data scraping
  const xpath_page = base_page_xpath;
  await page.waitForXPath(xpath_page);
  let list = await page.$x(xpath_page);
  let end_len = list.length;

  let lastIndx = base_page_xpath + "[" + end_len + "]";
  let lastIndx_value = await helper.getValueObjectFromXpath(page, lastIndx, '<div');
  setLimit = lastIndx_value;

  if (!setLimit) {
    end_len = end_len - 2;
  } else if (list.length > numOfPost) {
    end_len = numOfPost;
  } else {
    end_len = end_len - 1;
  }

  let start = (result.length > 0) ? result.length - 1 : 0;

  for (let index = start; index < end_len; index++) {
    let x = {}
    let indx = index + 1;

    let page_name_xpath = base_page_xpath + "[" + indx + "]" + page_pagename_xpath;
    x.page_name = await helper.getValueFromXpath(page, page_name_xpath);

    let page_link_url_xpath = base_page_xpath + "[" + indx + "]" + page_link_xpath;
    x.link = await helper.getHrefFromXpath(page, page_link_url_xpath, 'href');

    let page_id = x.link;
    let pageId_arr = page_id.split('/');
    x.page_id = pageId_arr[pageId_arr.length - 2];

    let page_description_xpath = base_page_xpath + "[" + indx + "]" + page_des_xpath;
    let description = await helper.getValueFromXpath(page, page_description_xpath, true);

    let page_verification_xpath = base_page_xpath + "[" + indx + "]" + page_verified_xpath;
    let page_verified = await helper.getValueFromXpath(page, page_verification_xpath, true);
    x.page_verified = (page_verified.length > 0) ? true : false;

    x.description = null;
    x.like = null;
    x.followers = null;

    if (description.length > 0) {

      if (description[1].includes('like') || description[1].includes('follower')) {
        let arr = description[1].split(' ');
        let indexFS = arr.indexOf('followers');
        if (indexFS != -1) {
          x.followers = arr[indexFS - 1];
        }

        let indexF = arr.indexOf('follower');
        if (indexF != -1) {
          x.followers = arr[indexF - 1];
        }

        let indexL = arr.indexOf('like');
        if (indexL != -1) {
          x.like = arr[indexL - 1];
        }
      }

      if (description[2]) {
        x.description = description[2];
      }


    }

    let page_img_xpath = base_page_xpath + "[" + indx + "]" + page_image_xpath;
    x.img = await helper.getSrcFromSVG(page, page_img_xpath);
    await Pages.create(x);
    result.push(x);
  }
  if ((result.length < numOfPost) && setLimit) {
    await helper.pageScrollTillCount(page, numOfPost);
    await page.waitForTimeout(5000);
    //let list_new = await helper.getList(page,base_page_xpath);
    //if(list_new.length>list.length){
    await getPageInfo(page, numOfPost);
    //}else{
    //          return result;
    //      } 
  }
  return result;
}

let getPostInfo = async (page, numOfPost) => {

  //data scraping
  let setLimit = true;
  const xpath_posts = base_hashtag_xpath;
  await page.waitForXPath(xpath_posts);
  let list = await page.$x(xpath_posts);
  let end_len = list.length;


  await page.waitForTimeout(5000);
  let lastIndx = base_hashtag_xpath + "[" + end_len + "]";
  let lastIndx_value = await helper.getValueObjectFromXpath(page, lastIndx, '<div');
  setLimit = lastIndx_value;

  if (!setLimit) {
    end_len = end_len - 2;
  } else if (list.length > numOfPost) {
    end_len = numOfPost;
  } else {
    end_len = end_len - 1;
  }

  let start = (result.length > 0) ? result.length - 1 : 0

  for (let index = start; index < end_len; index++) {
    let x = {}
    let indx = index + 1;
    let date_arr;
    if (indx != 4 && indx != 3) {
      let post_user_xpath = base_hashtag_xpath + "[" + indx + "]" + post_username_xpath;
      x.sender = await helper.getValueFromXpath(page, post_user_xpath);

      let groupid_userid_xpath = base_hashtag_xpath + "[" + indx + "]" + hashtag_group_user_id_xpath;
      let groupid_userid = await helper.getHrefFromXpath(page, groupid_userid_xpath, 'href');

      let fbid_xpath = base_hashtag_xpath + "[" + indx + "]" + hashtag_post_fbid_xpath;
      let fbid = await helper.getHrefFromXpath(page, fbid_xpath, 'href');
      x.post_link = fbid;
      let fb_id_arr = fbid.split('/');

      let grp_arr = groupid_userid.split('/');
      x.group_id = '';
      x.user_id = '';
      if (groupid_userid.includes("/groups/")) {
        let post_usergroup_xpath = base_hashtag_xpath + "[" + indx + "]" + hashTag_group_name_xpath;
        x.group_name = await helper.getValueFromXpath(page, post_usergroup_xpath);

        if (grp_arr[1] && grp_arr[1] == 'groups') {
          x.group_id = grp_arr[2];
        }
        if (grp_arr[1] && grp_arr[1] == 'user') {
          x.user_id = grp_arr[2];
        }
        if (grp_arr[3] && grp_arr[3] == 'user') {
          x.user_id = grp_arr[4];
        }
        if (grp_arr[3] && grp_arr[3] == 'groups') {
          x.group_id = grp_arr[4];
        }
        x.post_id = fb_id_arr[fb_id_arr.length - 2];
        x.post_verified = false;
      } else {
        x.user_id = grp_arr[grp_arr.length - 2];
        x.post_id = fb_id_arr[fb_id_arr.length - 1];

        let post_like_xpath = base_hashtag_xpath + "[" + indx + "]" + hashtag_post_verified_xpath;
        let post_verified = await helper.getList(page, post_like_xpath);
        x.post_verified = (post_verified.length > 0) ? true : false;
      }


      let post_like_xpath = base_hashtag_xpath + "[" + indx + "]" + hashtag_like_xpath;
      let like = await helper.getValueFromXpath(page, post_like_xpath);

      if (like.includes('k')) {
        x.like = (parseInt(like.replace('K', ''))) * 1000;
      } else {
        x.like = parseInt(like);
      }


      let post_content_xpath = base_hashtag_xpath + "[" + indx + "]" + hashtag_content_xpath;
      let content = await helper.getValueFromXpath(page, post_content_xpath);

      date_arr = ((content).split(' ')).slice(0, 3);
      let today = new Date();
      x.post_date = null;
      if (date_arr[1].includes('hr') || date_arr[1].includes('min') || date_arr[1].includes('sec') || date_arr[1].includes('few')) {
        x.post_date = moment(new Date()).format('YYYY-MM-DD');
      } else if (date_arr[0] != '' && date_arr[1] != '' && (date_arr[0].includes('few') != true)) {
        date_arr[2] = (new Date).getFullYear();
        x.post_date = moment(new Date((date_arr.join("-")).replace(/\s/g, ""))).format('YYYY-MM-DD');
      }

      x.content = (((content).split(' ')).slice(3)).join(' ');
      let comment_xpath = base_hashtag_xpath + "[" + indx + "]" + hastag_comment_xpath;
      let comments_share = await helper.getValueFromXpath(page, comment_xpath);

      let share_arr = comments_share.split(" ");
      x.comment = null;
      x.share = null;

      if (share_arr[1] && share_arr[1].includes('comment')) {
        x.comment = (share_arr[0].includes('K')) ? (parseInt(share_arr[0].replace('K', ''))) * 1000 : share_arr[0];
      } else if (share_arr[3] && share_arr[3].includes('comment')) {
        x.comment = (share_arr[2].includes('K')) ? (parseInt(share_arr[2].replace('K', ''))) * 1000 : share_arr[2];
      }

      if (share_arr[1] && share_arr[1].includes('share')) {
        x.share = share_arr[0]
      } else if (share_arr[3] && share_arr[3].includes('share')) {
        x.share = share_arr[2]
      }

      let post_img_xpath = base_hashtag_xpath + "[" + indx + "]" + hashtag_postImgUrl_xpath;
      x.img = await helper.getSrcFromXpath(page, post_img_xpath, 'src');

      x.fb_id = null;
      x.search_type = searchType;
      x.search_text = searchText;
      await Posts.create(x);
      result.push(x);
    }
  }
  //debugger
  if ((result.length < numOfPost) && setLimit) {
    await helper.pageScrollTillCount(page, numOfPost);
    await page.waitForTimeout(5000);
    await getPostInfo(page, numOfPost);
  }
  return result;
}


