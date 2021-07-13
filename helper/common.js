const cookieParser = require('cookie-parser');
const puppeteer = require('puppeteer');
const scrollDown = require('puppeteer-autoscroll-down');
const fs =  require('fs');
const cookies = require('./cookies.json');
exports.fbLogin = async(page, res) => {

    if(Object.keys(cookies).length){
        await page.setCookie(...cookies);
        await page.goto('https://www.facebook.com');
        try{
            await page.waitForXPath("//div//input[@type='search']");
            return true;
        }catch(error){
            return (this.loginCred(page))?true:false;
        }
    }else{
        return (this.loginCred(page))?true:false;
    }
  }

exports.loginCred =async(page)=>{
    await page.type('#email','ranjan.s@devtrust.biz');
    await page.type('#pass','ranjan@09');
    await page.click('button[name="login"]')
    await page.waitForNavigation({waitUntil:'networkidle0'});
    await page.waitForTimeout(5000);
    try{
        await page.waitForXPath("//div//input[@type='search']");
        let currentCookies = await page.cookies();
        fs.writeFileSync('./helper/cookies.json', JSON.stringify(currentCookies));
        return true;
    }catch(error){
        return false;
    }
} 

exports.searchHashTag = async(page,searchText)=>{
    //debugger;
    await page.waitForTimeout(5000);
    await page.waitForXPath("//div//input[@type='search']");
    await page.type('input[type=search]',searchText);
    await page.keyboard.press(String.fromCharCode(13));
    await page.waitForTimeout(5000);
    return true;
}

exports.pageScrollTillCount = async(page,numOfPost)=>{    
    return await scrollDown(page);
}

exports.getValueObjectFromXpath = async(page,xpath,search) =>{
    try{
        //debugger;
        await page.waitForXPath(xpath);
        let list = await page.$x(xpath);
        if(list.length>0){
            let result = await page.evaluate((...list) => {
                return list.map(e => e.innerHTML);
                }, ...list);

       // console.log("result",result);
        let response = result[0].includes(search);        
        return response;
        }else{
            return false    
        }
        
    }catch(error){
        console.log(error);
        return false;
      }
}

exports.getValueFromXpath = async(page,xpath,arr_return=false) =>{
    try{
        //debugger;
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
        //debugger;
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
