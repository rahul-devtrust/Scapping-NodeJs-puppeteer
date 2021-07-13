const puppeteer = require('puppeteer');
const scrollDown = require('puppeteer-autoscroll-down')

class facebookController{
   }

      async fbHandler(req,res){
        this_.check(req,res);
        const browser = await puppeteer.launch({headless:false,defaultViewport: null, args: ['--start-maximized']});
        const page = await browser.newPage();
        await page.goto('https://www.facebook.com');
        
        
        //login into fb
        await page.type('#email','mamta.s@devtrust.io');
        await page.type('#pass','mamta@#!');
        await page.click('button[name="login"]')

        await page.waitForNavigation({waitUntil:'networkidle0'});
        await page.waitForTimeout(10000);
        
        
        //search hashtag/keyward 
        let searchType = 'hashtag' // this would come from request parameters.
        let searchText = '#hollywood';
        const numberOfPost = 100;
        await page.type('input[type=search]',searchText);
        await page.keyboard.press(String.fromCharCode(13));
        await page.waitForTimeout(5000);
        let hashTagData = {
            generalInfo:{name:'',reach:''},
            post:[]
        }
        switch(searchType)  
        {  
         case 'hashtag':  
        //getting general information
        hashTagData.generalInfo.name = searchText;
        const xpath_hashTagReach = "//div[@class='bi6gxh9e aov4n071']/span";
        await page.waitForXPath(xpath_hashTagReach);
        const numbersOfPosts = await page.$x(xpath_hashTagReach);
        hashTagData.generalInfo.reach = await page.evaluate(el => el.textContent, numbersOfPosts[0]);
        console.log("hashTagData",hashTagData.generalInfo);  

        let base_hashtag_xpath = "//div[@class='rq0escxv l9j0dhe7 du4w35lb fhuww2h9 hpfvmrgz gile2uim pwa15fzy g5gj957u aov4n071 oi9244e8 bi6gxh9e h676nmdw aghb5jc5']/div";
        let count = 0;
        do {
                let position  = await scrollDown(page);
                //await page.keyboard.press('Space');
                const xpath_posts = base_hashtag_xpath;
                await page.waitForXPath(xpath_posts);
                let list = await page.$x(xpath_posts);
                count = count + list.length;
        } while (count < 10);

        let post_username_xpath = "[1]//div[@class='pybr56ya dati1w0a hv4rvrfc n851cfcs btwxx1t3 j83agx80 ll8tlv6m']/div[2]//h2/div/div/span/span/span/a/span";
        let post_user_xpath = base_hashtag_xpath+post_username_xpath;
        await page.waitForXPath(post_user_xpath);
        let list_post = await page.$x(post_user_xpath);

        let hashTagsPostsList = await page.evaluate((...list_post) => {
        return list_post.slice(0, 10).map(e => e.textContent);
        }, ...list_post);

        console.log("hashTagsPostsList",hashTagsPostsList.length,hashTagsPostsList);

        let group_name_xpath = "[1]//div[@class='pybr56ya dati1w0a hv4rvrfc n851cfcs btwxx1t3 j83agx80 ll8tlv6m']/div[2]//h2/div/div/span/span/a/span";
        let post_usergroup_xpath = base_hashtag_xpath+group_name_xpath;
        await page.waitForXPath(post_usergroup_xpath);
        let list_post_group = await page.$x(post_usergroup_xpath);

        let hashTagsPostsGroup = await page.evaluate((...list_post_group) => {
        return list_post_group.slice(0, 10).map(e => e.textContent);
        }, ...list_post_group);

        console.log("hashTagsPostsGroup",hashTagsPostsGroup.length,hashTagsPostsGroup);
        
        
       

        break;    
        default:  
            // trending posts;  
        } 

        //div[@class='bi6gxh9e aov4n071']/h2/span

        //div[@class='bi6gxh9e aov4n071']/span

        //
        //await browser.close();
        res.send("controller is working");
    }

     check(req,res){
         console.log("hello");
     }

}

module.exports = facebookController;


// //open public DD
    // let pub_post_DD_xpath = "//div[@class='oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 j83agx80 mg4g778l btwxx1t3 pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb lzcic4wl abiwlrkh p8dawk7l']//span[text()='Posts from']";
    // const post_DD_elements = await page.$x(pub_post_DD_xpath);
    // await post_DD_elements[0].click();
    // await page.waitForTimeout(8000);

    // //open public posts
    // let pub_post_DD_opt_xpath = "//div[@class='hpfvmrgz g5gj957u buofh1pr rj1gh0hx o8rfisnq']//span[text()='Public posts']";
    // const post_DD_opt_elements = await page.$x(pub_post_DD_opt_xpath);
    // await post_DD_opt_elements[0].click();
    // await page.waitForTimeout(8000);