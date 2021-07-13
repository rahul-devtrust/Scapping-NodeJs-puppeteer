const puppeteer = require('puppeteer');
const helper = require('../helper/common');
const moment = require('moment');
const youTube = require('../models').y_trending;
const fs = require('fs');


const name_xpath = '//div[@id="channel-header"]//ytd-channel-name//div[@id="text-container"]/yt-formatted-string';
const about_button_xpath = "//div[contains(text(),'About')]";
const about_xpath = '//ytd-channel-about-metadata-renderer//div[@id="left-column"]/div[@id="description-container"]';
const subscribers_xpath = '//div[@id="channel-header"]//yt-formatted-string[@id="subscriber-count"]';
const views_xpath = '//ytd-channel-about-metadata-renderer//div[@id="right-column"]/yt-formatted-string[3]';
const number_of_video = ''
const playlists = '';
const join_date_xpath = '//ytd-channel-about-metadata-renderer//div[@id="right-column"]/yt-formatted-string[2]';
const playlist_base_xpath = '//ytd-grid-playlist-renderer';
const playlist_url_xpath = '//a[@class="yt-simple-endpoint style-scope yt-formatted-string"]';
//Featured/Related Channels, 
//Community posts and total number of Votes.

exports.channel = async (req, res) => {
    let browser;
    try {
        //setup
        //debugger;
        const { filters } = res.locals;
        //console.log(filters.search_text);
        let pageUrl = filters.search_text;
        const numberOfPost = 20;
        //'--no-sandbox',
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
                console.log('error')
            })

        let result = await scrapePostInfo(page, pageUrl, numberOfPost);

        res.send({
            error: false,
            errorMsg: '',
            result: result
        })

    } catch (error) {
        console.log(error)
        await browser.close();
        res.send({
            error: true,
            errorMsg: 'Something went wrong',
            result: []
        })
    }

}

let scrapePostInfo = async (page, pageUrl, numOfPost) => {
    try {
        //debugger;
        let result = [{
            'name': await getName(page),
            'about': await getGeneralInfo(page, pageUrl),
            'playlist': await getPlayList(page, pageUrl),
            // 'comunity': await getComunityPosts(page),
        }];
        return result;
    } catch (error) {
        //console.log(error);
        res.send({
            error: true,
            errorMsg: 'error',
            result: []
        })
    }
}

let getPlayList = async (page, search_text) => {
    try {
        //debugger;
        let pageUrl = search_text + "/playlists"
        await page.goto(pageUrl);
        await page.waitForTimeout(10000);

        await page.waitForXPath(playlist_base_xpath);
        let list = await page.$x(playlist_base_xpath);
        let result = [];
        for (let inn_index = 0; inn_index <= list.length - 1; inn_index++) {
            let inn_indx = inn_index + 1;
            let playlist_xpath = playlist_base_xpath + "[" + inn_indx + "]" + playlist_url_xpath;
            let playlist = await helper.getHrefFromXpath(page, playlist_xpath);
            result.push(playlist);
        }
        return result;

    } catch (error) {
        return null;
    }
}

let getGeneralInfo = async (page, search_text) => {
    try {
        //debugger;
        let about = {
            description: '',
            views: '',
            join_date: ''
        }

        let pageUrl = search_text + "/about"
        await page.goto(pageUrl, {
            waitUntil: ['load', 'networkidle2'],
            timeout: 10000,
        });
        await page.waitForTimeout(10000);
        about.description = await helper.getValueFromXpath(page, about_xpath);
        about.views = await helper.getValueFromXpath(page, views_xpath);
        about.join_date = await helper.getValueFromXpath(page, join_date_xpath);
        return about;

    } catch (error) {
        console.log(error);
        return {};
    }
}

let getComunityPosts = async (page) => {
    let pageUrl = search_text + "/community"
    await page.goto(pageUrl);
    await page.waitForTimeout(10000);
    try {
        return [{
            post: 'Asd',
            view: '50'
        }]
    } catch (error) {
        return null;
    }
}

let getName = async (page) => {
    try {
        await page.waitForXPath(name_xpath);
        return await helper.getValueFromXpath(page, name_xpath);
    } catch (error) {
        return null;
    }
}

exports.checkFilter = async (req, res, next) => {
    //debugger;
    try {
        let filters = JSON.parse(req.headers.filters);
        if (filters.search_text) {
            res.locals.filters = filters;
            next();
        } else {
            throw new Error('No filter selected');
        }

    } catch (error) {
        res.send({
            error: true,
            errorMsg: 'No filter set',
            result: []
        })
    }
}
