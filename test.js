var { igDownloader } = require('./lib/newdown.js')

const dbot = require('dbot-api');
const user = 'https://www.instagram.com/reel/CXerZbnl4Di/?utm_medium=copy_link'
//const linka = 'https://www.tiktok.com/@fergarciatw/video/7041592671458168070?_d=secCgwIARCbDRjEFSACKAESPgo8ihpLrnTkC8snao9luOHtYOEiMLq32nan3OaMySvHOJNudWypbo2tMnYsx%2F9LG8OSVlCnpctYgFBTqoEiGgA%3D&language=es&preview_pb=0&sec_user_id=MS4wLjABAAAA-ZC1bNlvomClB7IGz--9FlY9xR7973DuwTlZ6F1kg8lg3M0UfcEcM4KWidX-eDEn&share_app_id=1233&share_item_id=7041592671458168070&share_link_id=0afba24a-2abb-4d47-8536-f32a2732d654&source=h5_m&timestamp=1639530843&u_code=dibkgfakc86ba8&user_id=6958275412707656710&utm_campaign=client_share&utm_medium=android&utm_source=copy&_r=1'

igDownloader(user)
    .then(result => {
     console.log(result)
});