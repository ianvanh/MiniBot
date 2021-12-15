const axios = require('axios')
const fetch = require('node-fetch') 
const cheerio = require('cheerio')

const ytv = async (yutub) => {
function post(url, formdata) {
    return fetch(url, {
        method: 'POST',
        headers: {
            accept: "*/*",
            'accept-language': "en-US,en;q=0.9",
            'content-type': "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: new URLSearchParams(Object.entries(formdata))
    })
}
const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
let ytId = ytIdRegex.exec(yutub)
url = 'https://youtu.be/' + ytId[1]
let res = await post(`https://www.y2mate.com/mates/en68/analyze/ajax`, {
    url,
    q_auto: 0,
    ajax: 1
  })
const mela = await res.json()
const $ = cheerio.load(mela.result)
const hasil = []
let thumb = $('div').find('.thumbnail.cover > a > img').attr('src')
let judul = $('div').find('.thumbnail.cover > div > b').text()
let quality = $('div').find('#mp4 > table > tbody > tr:nth-child(4) > td:nth-child(3) > a').attr('data-fquality')
let tipe = $('div').find('#mp4 > table > tbody > tr:nth-child(3) > td:nth-child(3) > a').attr('data-ftype')
let output = `${judul}.` + tipe
let size = $('div').find('#mp4 > table > tbody > tr:nth-child(2) > td:nth-child(2)').text()
let id = /var k__id = "(.*?)"/.exec(mela.result)[1]
let res2 = await post(`https://www.y2mate.com/mates/en68/convert`, {
    type: 'youtube',
    _id: id,
    v_id: ytId[1],
    ajax: '1',
    token: '',
    ftype: tipe,
    fquality: quality
  })
const meme = await res2.json()
const supp = cheerio.load(meme.result)
let link = supp('div').find('a').attr('href')
hasil.push({ thumb, judul, quality, tipe, size, output, link})
return hasil[0]
}


const yta= async (yutub) => {
function post(url, formdata) {
    return fetch(url, {
        method: 'POST',
        headers: {
            accept: "*/*",
            'accept-language': "en-US,en;q=0.9",
            'content-type': "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: new URLSearchParams(Object.entries(formdata))
    })
}
const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
let ytId = ytIdRegex.exec(yutub)
url = 'https://youtu.be/' + ytId[1]
let res = await post(`https://www.y2mate.com/mates/en68/analyze/ajax`, {
    url,
    q_auto: 0,
    ajax: 1
  })
const mela = await res.json()
const $ = cheerio.load(mela.result)
const hasil = []
let thumb = $('div').find('.thumbnail.cover > a > img').attr('src')
let judul = $('div').find('.thumbnail.cover > div > b').text()
let size = $('div').find('#mp3 > table > tbody > tr > td:nth-child(2)').text()
let tipe = $('div').find('#mp3 > table > tbody > tr > td:nth-child(3) > a').attr('data-ftype')
let output = `${judul}.` + tipe
let quality = $('div').find('#mp3 > table > tbody > tr > td:nth-child(3) > a').attr('data-fquality')
let id = /var k__id = "(.*?)"/.exec(mela.result)[1]
let res2 = await post(`https://www.y2mate.com/mates/en68/convert`, {
    type: 'youtube',
    _id: id,
    v_id: ytId[1],
    ajax: '1',
    token: '',
    ftype: tipe,
    fquality: quality
  })
const meme = await res2.json()
const supp = cheerio.load(meme.result)
let link = supp('div').find('a').attr('href')
hasil.push({ thumb, judul, quality, tipe, size, output, link})
return hasil[0]
}

async function Ttdl (Url) {
	return new Promise (async (resolve, reject) => {
		await axios.request({
			url: "https://ttdownloader.com/",
			method: "GET",
			headers: {
				"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
				"accept-language": "en-US,en;q=0.9,id;q=0.8",
				"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
				"cookie": "_ga=GA1.2.1240046717.1620835673; PHPSESSID=i14curq5t8omcljj1hlle52762; popCookie=1; _gid=GA1.2.1936694796.1623913934"
			}
		}).then(respon => {
			const $ = cheerio.load(respon.data)
			const token = $('#token').attr('value')
			axios({
				url: "https://ttdownloader.com/req/",
				method: "POST",
				data: new URLSearchParams(Object.entries({url: Url, format: "", token: token})),
				headers: {
					"accept": "*/*",
					"accept-language": "en-US,en;q=0.9,id;q=0.8",
					"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
					"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
					"cookie": "_ga=GA1.2.1240046717.1620835673; PHPSESSID=i14curq5t8omcljj1hlle52762; popCookie=1; _gid=GA1.2.1936694796.1623913934"
				}
			}).then(res => {
				const ch = cheerio.load(res.data)
				const result = {
					status: res.status,
					result: {
						nowatermark: ch('#results-list > div:nth-child(2)').find('div.download > a').attr('href'),
						watermark: ch('#results-list > div:nth-child(3)').find('div.download > a').attr('href'),
						audio: ch('#results-list > div:nth-child(4)').find(' div.download > a').attr('href')
					}
				}
				resolve(result)
			}).catch(reject)
		}).catch(reject)
	})
}

async function igDownloader(Link) {
  const hasil = []
  const Form = {
    url: Link,
    submit: ""
  }
  await axios(`https://downloadgram.org/`, {
    method: "POST",
    data:  new URLSearchParams(Object.entries(Form)),
    headers: {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9,id;q=0.8",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
      "cookie": "_ga=GA1.2.1695343126.1621491858; _gid=GA1.2.28178724.1621491859; __gads=ID=8f9d3ef930e9a07b-2258e672bec80081:T=1621491859:RT=1621491859:S=ALNI_MbqLxhztDiYZttJFX2SkvYei6uGOw; __atuvc=3%7C20; __atuvs=60a6eb107a17dd75000; __atssc=google%3B2; _gat_gtag_UA_142480840_1=1"
    },
    referrerPolicy: "strict-origin-when-cross-origin",
  }).then(async res => {
    const $ = cheerio.load(res.data)
    let url = $('#downloadBox').find('a').attr('href');
    await axios(Link, {
      method: "GET",
      data: null,
      headers: {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9,id;q=0.8",
        "cache-control": "max-age=0",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "cookie": "ig_did=08A3C465-7D43-4D8A-806A-88F98384E63B; ig_nrcb=1; mid=X_ipMwALAAFgQ7AftbrkhIDIdXJ8; fbm_124024574287414=base_domain=.instagram.com; shbid=17905; ds_user_id=14221286336; csrftoken=fXHAj5U3mcJihQEyVXfyCzcg46lHx7QD; sessionid=14221286336%3A5n4czHpQ0GRzlq%3A28; shbts=1621491639.7673564; rur=FTW"
      },
      referrerPolicy: "strict-origin-when-cross-origin"
    }).then(respon => {
      const ch = cheerio.load(respon.data)
      let title = ch('title').text().trim()
      const result = {
        status: true,
        result: {
          link: url,
          desc: title
        }
      }
      hasil.push(result)
    })
  })
  return hasil[0]
}


module.exports = { yta, ytv, Ttdl, igDownloader}