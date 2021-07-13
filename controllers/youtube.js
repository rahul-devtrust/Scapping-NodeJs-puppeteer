const puppeteer = require('puppeteer');
const helper = require('../helper/common');
const youTube = require('../models').y_trending

const base_path = "(//ytd-video-renderer)";
const title = "//yt-formatted-string";
const channel_name = "//ytd-video-meta-block//yt-formatted-string";
const views = "//ytd-video-meta-block//div[@id='metadata-line']/span[1]";
const date_time = "//ytd-video-meta-block//div[@id='metadata-line']/span[2]";
const description = "//yt-formatted-string[@id='description-text']";
const img = "//img";
const video_url = "//a[@id='thumbnail']";
const duration = "//a[@id='thumbnail']//span[@id='text']"

let browser;
exports.trend = async (req, res) => {
    debugger;
    try {
        //setup
        let pageUrl = 'https://www.youtube.com/feed/trending';
        const numberOfPost = 20;
        browser = await puppeteer.launch({ headless: true, defaultViewport: null, args: ['--no-sandbox', '--start-maximized'] });
        const page = await browser.newPage();
        await page.goto(pageUrl, {
            waitUntil: ['load', 'networkidle2'],
            timeout: 10000,
        });

        await page.waitForTimeout(10000);

        page.waitForXPath('//div[@class="qqtRac"]//button')
            .then(async (resp) => {
                let list = await page.$x('//div[@class="qqtRac"]//button');
                list[list.length - 1].click();
                await page.waitForTimeout(10000);
            })
            .catch(error => {
                console.log(error)
            })

        let result = await scrapePostInfo(page, numberOfPost);

        res.send({
            error: false,
            errorMsg: '',
            result: result
        })

    } catch (error) {
        await browser.close();

        res.send({
            error: true,
            errorMsg: 'Something went wrong',
            result: []
        })
    }

}

let scrapePostInfo = async (page, numOfPost) => {
    try {
        
        const xpath_posts = base_path;
        await page.waitForXPath(xpath_posts);
        let list = await page.$x(xpath_posts);
        let end_len = list.length;
        let result = [];
        
        for (let index = 0; index <= end_len - 1; index++) {

            let count = await helper.pageScrollTillCount(page, numOfPost);
            const xpath_video = xpath_posts;

            let x = {};
            let inn_indx = index + 1;

            let title_xpath = xpath_video + "[" + inn_indx + "]" + title;
            x.v_title = await helper.getValueFromXpath(page, title_xpath);

            let channel_name_xpath = xpath_video + "[" + inn_indx + "]" + channel_name;
            x.v_channel_name = await helper.getValueFromXpath(page, channel_name_xpath);

            let channel_views_xpath = xpath_video + "[" + inn_indx + "]" + views;
            x.v_channel_views = await helper.getValueFromXpath(page, channel_views_xpath);

            let channel_date_xpath = xpath_video + "[" + inn_indx + "]" + date_time;
            x.v_channel_date = await helper.getValueFromXpath(page, channel_date_xpath);

            let channel_des_xpath = xpath_video + "[" + inn_indx + "]" + description;
            x.v_description = await helper.getValueFromXpath(page, channel_des_xpath);

            let channel_img_xpath = xpath_video + "[" + inn_indx + "]" + img;
            x.v_img = await helper.getSrcFromXpath(page, channel_img_xpath);

            let channel_video_url_xpath = xpath_video + "[" + inn_indx + "]" + video_url;
            x.v_channel_video_url = await helper.getHrefFromXpath(page, channel_video_url_xpath);

            let channel_duration_xpath = xpath_video + "[" + inn_indx + "]" + duration;
            x.v_duration = await helper.getValueFromXpath(page, channel_duration_xpath);

            //console.log(Object.keys(x).join(':string,'));
            youTube.create(x);
            result.push(x);
        }

        return result;
    } catch (error) {
        throw new Error('something went wrong');
    }
}
