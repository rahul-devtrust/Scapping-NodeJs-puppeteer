const cookieParser = require('cookie-parser');
const puppeteer = require('puppeteer');
const scrollDown = require('puppeteer-autoscroll-down');
const fs =  require('fs');
const cookies = require('./cookies_insta.json');

exports.instaLogin = async(page, res) => {
  //  await page.goto('https://www.instagram.com/accounts/login/');
    if(Object.keys(cookies).length){
        await page.setCookie(...cookies);
        await page.goto('https://www.instagram.com/accounts/login/');
        try{            
             await page.waitForSelector('.XTCLo');
            return true;
        }catch(error){
            return (this.loginCred2(page))?true:false;
        }
    }else{
        return (this.loginCred2(page))?true:false;
    }
  }
exports.loginCred2 = async(page, res) => {
    await page.waitForSelector('input[name="username"]');
    // await page.type('input[name="username"]', 'devtdt');
    // await page.type('input[name="password"]', 'Q!W@e3r4');
    await page.type('input[name="username"]', 'ranjandevtrust');
    await page.type('input[name="password"]', 'ranjan@09');
    await page.click('button[type="submit"]');
    // Add a wait for some selector on the home page to load to ensure the next step works correctly
   // await page.pdf({path: 'page.pdf', format: 'A4'});
   await page.waitForNavigation({waitUntil:'networkidle0'});
    await page.waitForTimeout(5000);
    await this.saveinfo(page);
    try{
        await page.waitForSelector('.XTCLo');
        let currentCookies = await page.cookies();
        fs.writeFileSync('./helper/cookies_insta.json', JSON.stringify(currentCookies));
        return true;
    }catch(error){
        return false;
    }
  }
exports.searchAccount = async (page,searchAccount) => {
    await page.goto('https://www.instagram.com/'+searchAccount);
}
exports.saveinfo = async(page)=>{
    await page.click('button[type="button"]');
    await page.waitForTimeout(9000);
    await page.click(".HoLwm");
    return true;
}

exports.searchHashTag = async(page,searchText)=>{
    await page.type('.XTCLo', searchText);
    await page.waitForTimeout(3000);
    await page.type('.XTCLo',String.fromCharCode(13));
    await page.keyboard.press(String.fromCharCode(13));
    await page.waitForTimeout(5000);
    return true;
}
exports.pageScrollTillCount = async(page,numOfPost)=>{    
    return await scrollDown(page);
}

exports.getValueFromXpath = async(page,xpath,arr_return=false) =>{
    try{
        await page.waitForXPath(xpath);
        let list = await page.$x(xpath);
        if(list.length>0){
            let result = await page.evaluate((...list) => {
                return list.map(e => e.textContent);
                }, ...list);
        
                return (arr_return)?result:result[0];
        }else{
            return "";    
        }
        
    }catch(error){
        console.log(error);
        return "";
      }
}

exports.getHrefFromXpath = async(page,xpath) =>{
    try{
        await page.waitForXPath(xpath);
        let list = await page.$x(xpath);

        let result = await page.evaluate((...list) => {
        return list.map(e => e.getAttribute('href'));
        }, ...list);
        return result[0];
    }catch(error){
        console.log("error",xpath);
        return "";
      }
}

exports.getSrcFromXpath = async(page,xpath) =>{
    try{
        await page.waitForXPath(xpath);
        let list = await page.$x(xpath);

        let result = await page.evaluate((...list) => {
        return list.map(e => e.getAttribute('src'));
        }, ...list);
        return result[0];
    }catch(error){
      console.log("error",xpath);
        return "";
      }
}

exports.getSrcFromSVG = async(page,xpath) =>{
    try{
        await page.waitForXPath(xpath);
        let list = await page.$x(xpath);

        let result = await page.evaluate((...list) => {
        return list.map(e => e.getAttributeNS('http://www.w3.org/1999/xlink', 'href'));
        }, ...list);
        return result[0];
    }catch(error){
      console.log("error",xpath);
        return "";
      }
}

exports.getList = async(page,xpath) =>{
    try{
        await page.waitForXPath(xpath);
        let result = await page.$x(xpath);
        return result;
    }catch(error){
        console.log("error",xpath);
        return [];
      }
}
