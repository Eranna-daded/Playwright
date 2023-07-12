const { test, expect } = require('@playwright/test');

test.describe.serial('OAuth API', async () => 
{

    let id, access_token

    test('Generate Token', async ({ request }) => 
    {
        const formData = new URLSearchParams();
        formData.append('grant_type', 'client_credentials');
        formData.append('client_secret', 'a86b588f8734f1873cbd5f0d67011015');
        formData.append('client_id', 'E');
        const response = await request.post('http://coop.apps.symfonycasts.com/token',   
        {
            headers: 
            {
                'Content-Type': 'application/x-www-form-urlencoded'            
            },
            data: formData.toString()
        })
        let res = await response.json()
        access_token = res.access_token
        expect(response.status()).toBe(200)
        if (response.status() == 200 && access_token != null) 
        {
            console.log('Successfully generated Access Token')
        }
        else 
        {
            console.log('Failed to generate Access Token')
        }
    })

    test('Get My ID', async ({ request }) => {
        const response = await request.get('http://coop.apps.symfonycasts.com/api/me', {
            headers: {
                Authorization: "Bearer "+access_token
            }
        })
        const body = await response.json()
        id = body.id
        expect(response.status()).toBe(200)
        if (response.status() == 200 && id != null) 
        {
            console.log('Your User ID is => ' + id)
        }
        else {
            console.log('Failed to get User ID')
        }
    })




    test('Unlock the Barn', async ({ request }) => 
    {

        const response = await request.post('http://coop.apps.symfonycasts.com/api/' + id + '/barn-unlock', 
        {

            headers: 
            {

                Authorization: "Bearer " + access_token

            }

        })

        const body = await response.json()

        expect(response.status()).toBe(200)

        if (response.status() == 200) 
        {

            console.log(body.message)

        }

        else 
        {

            console.log('Failed to unlock the barn')

        }

    })




    test('Put the Toilet Seat Down', async ({ request }) => 
    {

        const response = await request.post('http://coop.apps.symfonycasts.com/api/' + id + '/toiletseat-down', {

            headers: 
            {

                Authorization: "Bearer " + access_token

            }

        })

        const body = await response.json()

        expect(response.status()).toBe(200)

        if (response.status() == 200) 
        {

            console.log(body.message)

        }

        else {

            console.log('Failed to put the toilet seat down')

        }

    })




    test('Feed the Chickens', async ({ request }) => {

        const response = await request.post('http://coop.apps.symfonycasts.com/api/' + id + '/chickens-feed', 
        {

            headers: 
            {

                Authorization: "Bearer " + access_token

            }

        })

        const body = await response.json()

        expect(response.status()).toBe(200)

        if (response.status() == 200) 
        {

            console.log(body.message)

        }

        else 
        {

            console.log('Failed to feed the chicken')

        }

    })




    test('Collect Eggs from Chickens', async ({ request }) => {

        const response = await request.post('http://coop.apps.symfonycasts.com/api/' + id + '/eggs-collect', 
        {

            headers: 
            {

                Authorization: "Bearer " + access_token

            }

        })

        const body = await response.json()

        expect(response.status()).toBe(200)

        if (response.status() == 200) {

            console.log(body.message)

        }

        else {

            console.log('Failed to collect the eggs from the chicken')

        }

    })




    test('Get the Number of Eggs Collected Today', async ({ request }) => {

        const response = await request.post('http://coop.apps.symfonycasts.com/api/' + id + '/eggs-count', {

            headers: {

                Authorization: "Bearer " + access_token

            }

        })

        const body = await response.json()

        expect(response.status()).toBe(200)

        if (response.status() == 200) {

            console.log(body.message)

        }

        else {

            console.log('Failed to collect the eggs from the chicken')

        }

    })

})