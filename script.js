// some crazy stuff going on
module.exports = async function(context, commands) {

    url = 'https://mclasshome.aws.wgen.net/dibels8-assessment/';

    await commands.navigate(url);

    const driver = context.selenium.driver;
    const webdriver = context.selenium.webdriver;

    // setup makeschreenshot func
    const takeScr = (driver, filename) => { driver.takeScreenshot().then(
        (image, err) => {
          require('fs').writeFile(filename, image, 'base64', (err) => {
            if (err != null) {
              console.log(err);
            }
          });
      })}

    
    // setup
    const userName = 'adibels8';
    const password = '1234';
    if (userName == undefined || password == undefined) {
        console.log("PROVIDE YOUR EMAIL AND PASSWORD!!!");
        return null;
    }
    const waitTime = 10000;
    const loginSelector = 'login-username';
    const paswdSelector = 'password';
    const logButtonSelector = 'login-submit';
    const waitForThisSelector = '.header';

    await commands.addText.byId(userName, loginSelector);
    await commands.addText.byId(password, paswdSelector);

    await commands.click.byIdAndWait(logButtonSelector);

    return await function() {
        driver.wait(until.elementLocated(By.css(waitForThisSelector)), waitTime);
    }
};