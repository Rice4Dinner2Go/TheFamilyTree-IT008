import api from './api.js';
async function delete_all_data ()
{
    try {
        // fetch the list of all persons
        const data = await api.getAllPersons();
        if(!data || data.length === 0)
        {
            console.log('No data to delete.');
            return;
        }


        // select each person and delete them 
        for (const person of data)
        {
            try{
                await api.deletePerson(person.id);
                console.log(`Deleted person with ID: ${person.id}`);
                const axios = require('axios');

                let config = 
                {
                    method: 'delete',
                    maxBodyLength: Infinity,
                    url: `https://squid-app-7jubn.ondigitalocean.app/family/persons/${person.id}`,
                    headers: 
                    { 
                        'accept': 'application/json', 
                        'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5', 
                        'origin': 'https://squid-app-7jubn.ondigitalocean.app', 
                        'priority': 'u=1, i', 
                        'referer': 'https://squid-app-7jubn.ondigitalocean.app/explorer/?fbclid=IwY2xjawHHxcVleHRuA2FlbQIxMAABHcLe2rx7O0jFYgeQv1USxFwYOGZa4IToI307eplVQIqevndFU0_zMWm_nw_aem_uxzaB0rDfEX6-17DitIxTA', 
                        'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"', 
                        'sec-ch-ua-mobile': '?0', 
                        'sec-ch-ua-platform': '"Windows"', 
                        'sec-fetch-dest': 'empty', 
                        'sec-fetch-mode': 'cors', 
                        'sec-fetch-site': 'same-origin', 
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
                    }
                };
                axios.request(config)
                .then((response) => {
                console.log(JSON.stringify(response.data));
                })
                .catch((error) => {
                console.log(error);
                });

            } 
            catch (error)
            {
                console.log(`Error deleting person with ID: ${person.id}`,error);
            }     
        }

        console.log('Completed deleting all data.');

    }
    catch (error)
    {
        console.log('Error fetching the list of persons or deleting data:',error);
    }

}