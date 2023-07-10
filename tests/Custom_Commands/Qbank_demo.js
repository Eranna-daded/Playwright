exports.Commands = class custom{
    constructor (page, testInfo){
        this.page =page
        this.testInfo = testInfo
    }
    async screenshot(path) {
        await this.testInfo.attach('ScreenShots', {
            body: await this.page.screenshot({ path: path }),
            contentType: 'image/png'
        })
    }
}