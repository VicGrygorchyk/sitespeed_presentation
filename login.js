// some crazy stuff going on
module.exports = {
  run(context) {
    return context.runWithDriver((driver) => {

      urlPLS = 'https://test.com';

      // Go to login URL
      return driver.get(urlPLS)
        .then(() => {
          // fetch the selenium webdriver from context
          const webdriver = context.webdriver;
          const until = webdriver.until;
          const By = webdriver.By;

          // setup
          const userName = 'name@gmail.com';
          const password = 'pass';
          const waitTime = 10000;

          const emailCSSSelector = ".test";
          const pswCSSSelector = ".test2";
          const submitButtonXPath = "//button[contains(@class, 'button') and .='Sign in']";
          const searchInputSelector = ".search-input";

          // all action here
          var email = driver.findElement(By.css(emailCSSSelector)).then((email) => {
              email.clear();
		          email.sendKeys(userName);
          });

          var pswd = driver.findElement(By.css(pswCSSSelector)).then((pswd) => {
              pswd.clear();
              pswd.sendKeys(password).then(()=> {
                 // click login after password provided
                 var loginButton = driver.findElement(By.xpath(submitButtonXPath)).then((loginButton)=>{
                   loginButton.click().then(()=>{
                     // wait until user profile is displayed
                     driver.wait(until.elementLocated(By.css(searchInputSelector)), waitTime);
                     return driver;
                   });
                 });
             });
	        });
        });
    })
  }
};