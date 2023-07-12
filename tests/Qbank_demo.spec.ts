import {test,expect} from '@playwright/test'
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const { Commands } = require('./Custom_Commands/Qbank_demo')
//const testdata= require('../TestData/json_testData1.json')

const records = parse(fs.readFileSync(path.join(__dirname, '../TestData/csv_testdata.csv')),{
    columns: true,
    skip_empty_lines: true
  });

test.describe('QBANK', async () => {
 //   for (const record of records) {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://qbank.accelq.com/')
        expect(page.locator("//div[contains(text(),'Welcome back!')]")).toBeVisible()
        await page.getByPlaceholder('Username').fill(records[0].username);
        await page.getByPlaceholder('Password').fill(records[0].password);
        await page.getByRole('button', { name: 'Sign In' }).click();
    })

    test('Qbank_Transaction_Validation', async ({page},testInfo) => 
    {
        console.log(records.username, records.password);
        const commands = new Commands(page, testInfo)
        function StrtoNum(String) 
        {
            let Amount = String.replace('$', '')
            Amount = Amount.replace(',', '')
            Amount = Amount.split('.')
            return Number(Amount[0])
        }
        await page.waitForSelector("//div[text()='Salary Account']")
        expect(page.getByRole('link', { name: 'Thomas' })).toBeVisible()
        await commands.screenshot('ScreenShots/HomePage.jpg')
        // await page.pause();
        let AccountBalance = await page.locator("//div[text()='Salary Account']/../..//div[contains(@class,'qb-account-balance')]").textContent()
        let BeforeBalance = StrtoNum(AccountBalance)
        console.log('Account balance before transaction => ' + AccountBalance)
        await page.getByText('Make a Transfer').click()
        expect(page.locator(".qbf-box-heading")).toContainText('Transfer Funds')
        await page.getByRole('combobox', { name: 'Transfer from' }).selectOption('Salary Account')
        await page.getByRole('combobox', { name: 'Transfer to' }).selectOption('Electricity Bill')
        await page.getByLabel('Amount ($)').fill('1')
        await page.getByLabel('Memo').fill('Elecricity Bill')
        await commands.screenshot('ScreenShots/BillPayment.jpg')
        await page.getByRole('button', { name: 'Submit' }).click()
        let transactionID = await page.locator("//span[contains(@class,'qbf-transaction-id')]").textContent()
        console.log('Transacation ID => ' + transactionID)
        await commands.screenshot('ScreenShots/BillRecipt.jpg')
        await page.getByRole('button', { name: 'Go to Account Summary' }).click()
        await page.waitForSelector("//div[text()='Salary Account']")
        await commands.screenshot('ScreenShots/AccountSummary.jpg')
        let BalanceAfter = await page.locator("//div[text()='Salary Account']/../..//div[contains(@class,'qb-account-balance')]").textContent()
        let AfetrBalance = StrtoNum(BalanceAfter)
        console.log('Account balance after transaction => ' + BalanceAfter)
        expect(AfetrBalance).toBeLessThan(BeforeBalance)
        let trnsactions = page.locator("//div[contains(text(),'Transaction ID:')]//b")
        let count = await trnsactions.count()
        let debitedAmount = BeforeBalance - AfetrBalance
        for (let i = 0; i < count; i++) 
        {
            let trnsaction = await trnsactions.nth(i).textContent()
            if (trnsaction == transactionID) 
            {
                console.log('Transaction Successfull of Amount $' + debitedAmount)
                break
            }
            else if (i >= count) 
            {
                console.log('Transaction Failed')
            }
        }
    })


    test('Qbank_Link_New_Account', async ({ page }, testInfo) => {
        const commands = new Commands(page, testInfo)
        let routingnum, accountnum,bankname,nickname
        let max =999999999
        let min = 100000000
        routingnum=''+Math.floor((Math.random()*(max-min+1))+min)
        accountnum=Math.floor((Math.random()) * 100000)+'-'+Math.floor((Math.random()*(10001-99999+1))+10001)
        bankname='Qbank'
        nickname='IronMan'
        await page.getByText('Link a New Account').click();
        //await page.pause();
        await commands.screenshot('ScreenShots/LinkNewAccount1.jpg');
        await page.locator('#qba-routingnum-input').fill(routingnum);
        await page.locator('#qba-accountnum-input').fill(accountnum);
        await page.locator('#qba-confAcnum-input').fill(accountnum);
        await page.getByText('Savings', { exact: true }).check();
        await page.locator('#qba-bankname-input').fill(bankname);
        await page.locator('#qba-nickname-input').fill(nickname);
        await commands.screenshot('ScreenShots/LinkNewAccount2.jpg')
        await page.getByRole('button', { name: 'Verify' }).click();
        const Routing=await page.locator("//div[contains(text(),'Routing number')]/following-sibling::div").textContent()
        expect(Routing).toContain(routingnum)
        const Account=await page.locator("//div[contains(text(),'Account number')]/following-sibling::div").textContent()
        expect(Account).toContain(accountnum)
        const Bank=await page.locator("//div[contains(text(),'Bank name')]/following-sibling::div").textContent()
        expect(Bank).toContain(bankname)
        const Nick=await page.locator("//div[contains(text(),'Account nickname')]/following-sibling::div").textContent()
        expect(Nick).toContain(nickname)
        await commands.screenshot('ScreenShots/VerifyAccount.jpg')
        await page.getByRole('button', { name: 'Confirm' }).click();
        await page.waitForSelector("//button[text()='Start a fund transfer']")
        const Confirmation = await page.locator(".qbf-confBox-label").textContent()
        console.log('Confirmation text => '+Confirmation)
        expect(Confirmation).toContain(accountnum)
        await commands.screenshot('ScreenShots/ConfirmAccount.jpg')
    })
})