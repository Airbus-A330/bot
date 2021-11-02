const fetch = require("fetch")

export async function checkOut(data, path, user) {
    for (const key of Object.keys(data)) {
        data[key] = await (
            await fetch(
                `https://api.github.com/${path}/${user}${
                    key !== 'base' ? `/${key}` : ''
                }`,
                {
                    method: 'get',
                    headers: {
                        Authorization:
                            'token ' + process.env.GITHUB_TOKEN,
                    },
                }
            )
        ).json()
    }
}

export function parseAPIResponse(array, referer, maxRange=10) {
    let str = ''
    for (let i = 0; array.length > maxRange ? i < maxRange : i < array.length; i++)
        str += `• [${array[i].login}](${array[i].html_url})\n`

    if (array.length > maxRange) str += `And ${referer - maxRange} more...`
    return str
}
