
import axios from "axios";

/**
 * Brief: Get Whois record of domain using cloudflare api
 */
export default async function getWhoisRecord({ account_id, domain }: { account_id: any, domain: string }): Promise<any> {
    try {
        const cloudflare_email = String(process.env.CLOUDFLARE_EMAIL)
        const cloudflare_api_key = String(process.env.CLOUDFLARE_API_KEY)
        const cloudflare_api_token = String(process.env.CLOUDFLARE_API_TOKEN)
        const options = {
            method: 'GET',
            url: `https://api.cloudflare.com/client/v4/accounts/${account_id}/intel/whois?domain=${domain}`,
            headers: { 'Content-Type': 'application/json', 'X-Auth-Email': cloudflare_email, 'X-Auth-Key': cloudflare_api_key, 'Authorization': `Bearer ${cloudflare_api_token}` },
        };

        const result = await axios.request(options);
        return result.data
    } catch (error) {
        console.error(error);
    }
}