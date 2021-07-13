const puppeteer = require('puppeteer');
const helper = require('../helper/common');
const Posts = require('../models').Posts;
const base_hashtag_xpath = "//div[@class='rq0escxv l9j0dhe7 du4w35lb fhuww2h9 hpfvmrgz gile2uim pwa15fzy g5gj957u aov4n071 oi9244e8 bi6gxh9e h676nmdw aghb5jc5']/div";
const post_username_xpath = "//div[@class='pybr56ya dati1w0a hv4rvrfc n851cfcs btwxx1t3 j83agx80 ll8tlv6m']/div[2]//h2/div/div/span/span/span/a/span";
const group_name_xpath = "//div[@class='pybr56ya dati1w0a hv4rvrfc n851cfcs btwxx1t3 j83agx80 ll8tlv6m']/div[2]//h2/div/div/span/span/a/span";
const hashtag_like_xpath = "//span[@class='pcp91wgn']";
const hastag_comment_xpath = "//div[@class='bp9cbjyn j83agx80 pfnyh3mw p1ueia1e']";
const hashtag_content_xpath = "//div[@class='ecm0bbzt hv4rvrfc ihqw7lf3 dati1w0a']";
const hashtag_postImgUrl_xpath = "//div[@class='bp9cbjyn cwj9ozl2 j83agx80 cbu4d94t ni8dbmo4 stjgntxs l9j0dhe7 k4urcfbm']//img[1]";
const hashtag_group_user_id_xpath = "//div[@class='pybr56ya dati1w0a hv4rvrfc n851cfcs btwxx1t3 j83agx80 ll8tlv6m']/div[2]//h2/div/div/span/span/span/a";
const hashtag_post_fbid_xpath = "//div[contains(@class,'l9j0dhe7')]/div[@class='l9j0dhe7']//a";
const hastag_post_datetime_xpath = "//span[@class='b6zbclly myohyog2 l9j0dhe7 aenfhxwr l94mrbxd ihxqhq3m nc684nl6 t5a262vz sdhka5h4']";
let result = [];
let listlen = 0;
let searchText = '';



exports.fbHasTag = async (req, res) => {
    //setup
    try {
        if (req.headers && req.headers.filters) {
            let filters = JSON.parse(req.headers.filters);
            searchText = filters.search_text;
            const numberOfPost = (filters.limit != '') ? filters.limit : 10;
            const browser = await puppeteer.launch({ headless: true, defaultViewport: null, args: ['--no-sandbox', '--start-maximized'] });
            const page = await browser.newPage();
            let loginRes = await helper.fbLogin(page);
            if (loginRes) {
                await helper.searchHashTag(page, searchText);
                let count = await helper.pageScrollTillCount(page, numberOfPost);
                let result = await scrapePostInfo(page, numberOfPost);
                //console.log("result",result.length,result);
                await browser.close();
                res.send({
                    error: false,
                    errorMsg: '',
                    result: result
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
    }
    catch (error) {
        console.log("error", error)
        res.send({
            error: true,
            errorMsg: 'error',
            result: []
        });
    }
}


let scrapePostInfo = async (page, numOfPost) => {
    //debugger;
    const xpath_posts = base_hashtag_xpath;
    await page.waitForXPath(xpath_posts);
    let list = await page.$x(xpath_posts);
    let end_len = list.length;
    if (list.length > numOfPost) {
        end_len = numOfPost;
    }
    console.log('list.length', list.length, result.length);
    //let start = (result.length==0)?0   
    let start = (result.length > 0) ? result.length - 1 : 0
    for (let index = start; index < end_len; index++) {
        let x = {}
        let indx = index + 1;
        console.log("indx", indx);

        let post_user_xpath = base_hashtag_xpath + "[" + indx + "]" + post_username_xpath;
        x.sender = await helper.getValueFromXpath(page, post_user_xpath);

        let post_usergroup_xpath = base_hashtag_xpath + "[" + indx + "]" + group_name_xpath;
        x.group_name = await helper.getValueFromXpath(page, post_usergroup_xpath);

        let post_like_xpath = base_hashtag_xpath + "[" + indx + "]" + hashtag_like_xpath;
        x.like = await helper.getValueFromXpath(page, post_like_xpath);

        let post_content_xpath = base_hashtag_xpath + "[" + indx + "]" + hashtag_content_xpath;
        x.content = await helper.getValueFromXpath(page, post_content_xpath);

        let comment_xpath = base_hashtag_xpath + "[" + indx + "]" + hastag_comment_xpath;
        let comments_share = await helper.getValueFromXpath(page, comment_xpath);

        //need to extract comment and share
        x.comment = comments_share;
        x.share = comments_share;

        //let fbid_xpath = base_hashtag_xpath+"["+indx+"]"+hashtag_post_fbid_xpath;
        //x.post_id=await helper.getHrefFromXpath(page,fbid_xpath,'href');
        x.post_id = null;
        let groupid_userid_xpath = base_hashtag_xpath + "[" + indx + "]" + hashtag_group_user_id_xpath;
        let groupid_userid = await helper.getHrefFromXpath(page, groupid_userid_xpath, 'href');

        x.group_id = groupid_userid;
        x.user_id = groupid_userid;

        //let post_img_xpath = base_hashtag_xpath+"["+indx+"]"+hashtag_postImgUrl_xpath;
        //x.img=await helper.getSrcFromXpath(page,post_img_xpath,'src');
        x.img = null;
        x.search_type = 'hashTag';
        x.search_text = searchText;
        x.post_date = null;
        x.fb_id = null;

        //await Posts.create(x);

        // let post_date_time_xpath = base_hashtag_xpath+"["+indx+"]"+hastag_post_datetime_xpath;
        // x.post_date=await helper.getValueFromXpath(page,post_date_time_xpath,'src');
        result.push(x);
    }
    console.log("result.length < numOfPost", result.length, numOfPost)
    if (result.length < numOfPost) {
        await helper.pageScrollTillCount(page, numOfPost);
        await scrapePostInfo(page, numOfPost);
    }
    return result;
}
