const puppeteer = require('puppeteer');
const scrollDown = require('puppeteer-autoscroll-down')

class facebookController{

      async index(req,res){
        const browser = await puppeteer.launch({headless:false,defaultViewport: null, args: ['--start-maximized']});
        const page = await browser.newPage();
        await page.goto('https://www.facebook.com');
        
        //login into fb
        await page.type('#email','mamta.s@devtrust.io');
        await page.type('#pass','mamta@#!');
        await page.click('button[name="login"]')

        await page.waitForNavigation({waitUntil:'networkidle0'});
        await page.waitForTimeout(10000);
        
        //click on group icon
        const elements = await page.$x('//li[@class="buofh1pr to382e16 o5zgeu5y jrc8bbd0 dawyy4b1 bx45vsiw h676nmdw"]');
        await page.waitForTimeout(10000);
        await elements[0].click();
        await page.waitForTimeout(10000);

        //listing the group name
        const xpath_expression = "//div[@class='rq0escxv l9j0dhe7 du4w35lb j83agx80 pfnyh3mw i1fnvgqd gs1a9yip owycx6da btwxx1t3 hv4rvrfc dati1w0a f10w8fjw pybr56ya b5q2rw42 lq239pai mysgfdmx hddg9phg']/following-sibling::div//a//span[@class='d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh jq4qci2q a3bd9o3v lrazzd5p oo9gr5id']";
        await page.waitForXPath(xpath_expression);
        //this will generate ElementHandle, can perform click and go inside a group
        const listOfGroupsElement = await page.$x(xpath_expression); 
        
        // here we get the name of groups from the ElementHandle.
        const listOfGroupName = await page.evaluate((...listOfGroupsElement) => {
        return listOfGroupsElement.map(e => e.textContent);
        }, ...listOfGroupsElement);

        //console.log("listOfGroupName",listOfGroupName);

        //entering into a group and then scrape the posts and details
        listOfGroupsElement[0].click();
        await page.waitForTimeout(10000);

        //open about 
        const xpath_about = "(//div[@class='rq0escxv l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t gs1a9yip owycx6da btwxx1t3 cddn0xzi dsne8k7f']//div[@class='bp9cbjyn rq0escxv pq6dq46d pfnyh3mw frgo5egb l9j0dhe7 bzsjyuwj cb02d2ww j1lvzwm4 hv4rvrfc dati1w0a']//span[text()='About'])[2]";
        await page.waitForXPath(xpath_about);
        const about_link = await page.$x(xpath_about); 
        about_link[0].click();
        await page.waitForTimeout(10000);

        const groupScrapedData = {
            basicDetails:{info:[], creationDate:''},
            postDetails:{user_name:'', post_date:'', post_content:''}
        };

        //group info        
        const xpath_groupInfo = "//div[@class='rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t buofh1pr tgvbjcpo muag1w35 enqfppq2']//div[@class='qzhwtbm6 knvmm38d']//span[@class='d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a5q79mjw g1cxx5fr ekzkrbhg oo9gr5id']";
        await page.waitForXPath(xpath_groupInfo);
        const listOfGroupsInfo = await page.$x(xpath_groupInfo); 

        groupScrapedData.basicDetails.info = await page.evaluate((...listOfGroupsInfo) => {
        return listOfGroupsInfo.map(e => e.textContent);
        }, ...listOfGroupsInfo);

        //group created date
        const xpath_groupCreated = "//span[text()='History']//ancestor::div[@class='j83agx80 cbu4d94t ew0dbk1b irj2b8pg']//span[@class='d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh e9vueds3 j5wam9gi knj5qynh oo9gr5id']";
        await page.waitForXPath(xpath_groupCreated);
        const groupCreatedOn = await page.$x(xpath_groupCreated);
        groupScrapedData.basicDetails.creationDate = await page.evaluate(el => el.textContent, groupCreatedOn[0]);

        console.log("groupScrapedData.basicDetails",groupScrapedData.basicDetails);

        //open group posts'
        const xpath_groupPostLink = "(//div[@class='bp9cbjyn rq0escxv j83agx80 pfnyh3mw frgo5egb l9j0dhe7 cb02d2ww hv4rvrfc dati1w0a']//span[text()='Discussion'])[2]";
        await page.waitForXPath(xpath_groupPostLink);
        const group_post_link = await page.$x(xpath_groupPostLink); 
        group_post_link[0].click();
        await page.waitForTimeout(10000);


        //scroll the page for posts
        const delay = 3000;
        let preCount = 0;
        let postCount = 0;
        //const lastPosition = await scrollDown(page)
        //await page.evaluate(() => document.querySelector('#my-sweet-id').innerHTML)
        
        //group [post]
        const xpath_groupPost = "//div[@class='du4w35lb k4urcfbm l9j0dhe7 sjgh65i0']";
        await page.waitForXPath(xpath_groupPost);
        const groupPost = await page.$x(xpath_groupPost);
        const post = await page.evaluate(el => el.innerHTML, groupPost[0]);
        console.log("psot",post);
        
        // do {
        // preCount = await this.getCount(page,'du4w35lb k4urcfbm l9j0dhe7 sjgh65i0');
        // console.log("preCount",preCount);
        // await this.scrollDown(page,'du4w35lb k4urcfbm l9j0dhe7 sjgh65i0:last-child');
        // await page.waitForTimeout(delay);
        // postCount = await this.getCount(page);
        // console.log("postCount",postCount);
        // } while (postCount > preCount);
        // await page.waitForTimeout(delay);






        

        // //group name
        // const xpath_groupName = "//h2/span";
        // await page.waitForXPath(xpath_groupName);
        // const groupName = await page.$x(xpath_groupName);
        // const name = await page.evaluate(el => el.textContent, groupName[0]);
        // console.log("groupName",name);

        // //group description
        // const xpath_groupDes = "//div[@class='rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t buofh1pr tgvbjcpo muag1w35 enqfppq2']//div[@class='ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi a8c37x1j']//div[@dir='auto']";
        // await page.waitForXPath(xpath_groupDes);
        // const groupDes = await page.$x(xpath_groupDes);
        // const description = await page.evaluate(el => el.textContent, groupDes[0]);
        // console.log("description",description);

        // //group type
        // const xpath_groupType = "(//div[@class='rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t buofh1pr tgvbjcpo muag1w35 enqfppq2']//div[@class='ow4ym5g4 auili1gw rq0escxv j83agx80 buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 nnctdnn4 hpfvmrgz qt6c0cv9 jb3vyjys l9j0dhe7 du4w35lb bp9cbjyn btwxx1t3 dflh9lhu scb9dxdr']//div[@class='hddg9phg'])[1]";
        // await page.waitForXPath(xpath_groupType);
        // const groupType = await page.$x(xpath_groupType);
        // const listOfGroupType = await page.evaluate(el => el.textContent, groupType[0]);
        // console.log("type",listOfGroupType);

        // //country
        // const xpath_groupCountry = "(//div[@class='rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t buofh1pr tgvbjcpo muag1w35 enqfppq2']//div[@class='qzhwtbm6 knvmm38d']//span[@class='d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j keod5gw0 nxhoafnm aigsh9s9 d3f4x2em fe6kdd0r mau55g9w c8b282yb mdeji52x a5q79mjw g1cxx5fr ekzkrbhg oo9gr5id hzawbc8m'])[3]";
        // await page.waitForXPath(xpath_groupCountry);
        // const groupCountry = await page.$x(xpath_groupCountry);
        // const country = await page.evaluate(el => el.textContent, groupCountry[0]);
        // console.log("country",country);
        //close the browser
        //await browser.close();
        //sending response to client
        res.send("controller is working");
    }

}

module.exports = facebookController;