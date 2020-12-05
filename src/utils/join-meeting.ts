import { ZoomMtg } from '@zoomus/websdk'
import { getCurrentDomain, serialize } from '@utils/zoom-tools'

// it's option if you want to change the WebSDK dependency link resources. setZoomJSLib must be run at first
// if (!china) ZoomMtg.setZoomJSLib('https://source.zoom.us/1.8.3/lib', '/av'); // CDN version default
// else ZoomMtg.setZoomJSLib('https://jssdk.zoomus.cn/1.8.3/lib', '/av'); // china cdn option
// ZoomMtg.setZoomJSLib('http://localhost:9999/node_modules/@zoomus/websdk/dist/lib', '/av'); // Local version default, Angular Project change to use cdn version
ZoomMtg.preLoadWasm()
ZoomMtg.prepareJssdk()

const API_KEY = process.env.API_KEY

const getMeetingConfig = () => {
    try {
        if (document === undefined || document === null)
            throw 'Document undefined'
        document.getElementById('display_name').value =
            'Local' +
            ZoomMtg.getJSSDKVersion()[0] +
            testTool.detectOS() +
            '#' +
            testTool.getBrowserInfo()
        document.getElementById('meeting_number').value = testTool.getCookie(
            'meeting_number'
        )
        document.getElementById('meeting_pwd').value = testTool.getCookie(
            'meeting_pwd'
        )
        if (testTool.getCookie('meeting_lang'))
            document.getElementById('meeting_lang').value = testTool.getCookie(
                'meeting_lang'
            )

        document
            .getElementById('meeting_lang')
            .addEventListener('change', (e) => {
                testTool.setCookie(
                    'meeting_lang',
                    document.getElementById('meeting_lang').value
                )
                $.i18n.reload(document.getElementById('meeting_lang').value)
                ZoomMtg.reRender({
                    lang: document.getElementById('meeting_lang').value
                })
            })

        // copy zoom invite link to mn, autofill mn and pwd.
        document
            .getElementById('meeting_number')
            .addEventListener('input', function (e) {
                let tmpMn = e.target.value.replace(/([^0-9])+/i, '')
                if (tmpMn.match(/([0-9]{9,11})/)) {
                    tmpMn = tmpMn.match(/([0-9]{9,11})/)[1]
                }
                let tmpPwd = e.target.value.match(/pwd=([\d,\w]+)/)
                if (tmpPwd) {
                    document.getElementById('meeting_pwd').value = tmpPwd[1]
                    testTool.setCookie('meeting_pwd', tmpPwd[1])
                }
                document.getElementById('meeting_number').value = tmpMn
                testTool.setCookie(
                    'meeting_number',
                    document.getElementById('meeting_number').value
                )
            })

        document.getElementById('clear_all').addEventListener('click', (e) => {
            testTool.deleteAllCookies()
            document.getElementById('display_name').value = ''
            document.getElementById('meeting_number').value = ''
            document.getElementById('meeting_pwd').value = ''
            document.getElementById('meeting_lang').value = 'en-US'
            document.getElementById('meeting_role').value = 0
            window.location.href = '/index.html'
        })
    } catch (error) {
        console.error(error)
    }
}

export const joinMeetingZoom = async (
    meetingNumber: string,
    username: string
) => {
    if (!meetingNumber || !username) {
        alert('Meeting number or username is empty')
        return false
    }
    // set cookies for later
    // testTool.setCookie('meeting_number', meetingConfig.mn)
    // testTool.setCookie('meeting_pwd', meetingConfig.pwd)

    try {
        // get signature
        let signature = await fetch(
            `/api/zoom/signature?meetingNumber=${encodeURIComponent(
                meetingNumber
            )}&role=${encodeURIComponent(role)}`
        )
        signature = await signature.json()

        const joinUrl = '/meeting.html?' + testTool.serialize(meetingConfig)
        console.log({ joinUrl })

        if (window === undefined) throw 'Window undefined'
        window.open(joinUrl, '_blank')
    } catch (error) {
        console.error(error)
    }
}

// click copy jon link button
// export const copyJoinLink = function (element: HTMLElement) {
//     const meetingConfig = testTool.getMeetingConfig()
//     if (!meetingConfig.mn || !meetingConfig.name) {
//         alert('Meeting number or username is empty')
//         return false
//     }
//     const signature = ZoomMtg.generateSignature({
//         meetingNumber: meetingConfig.mn,
//         apiKey: API_KEY,
//         apiSecret: API_SECRET,
//         role: meetingConfig.role,
//         success: function (res) {
//             console.log(res.result)
//             meetingConfig.signature = res.result
//             meetingConfig.apiKey = API_KEY
//             const joinUrl =
//                 testTool.getCurrentDomain() +
//                 '/meeting.html?' +
//                 testTool.serialize(meetingConfig)
//             $(element).attr('link', joinUrl)
//             const $temp = $('<input>')
//             $('body').append($temp)
//             $temp.val($(element).attr('link')).select()
//             document.execCommand('copy')
//             $temp.remove()
//         }
//     })
// }

export const getMeetingUrl = async (meetingNumber: string, role: number) => {
    try {
        // get signature
        let signature = await fetch(
            `/api/zoom/signature?meetingNumber=${encodeURIComponent(
                meetingNumber
            )}&role=${encodeURIComponent(role)}`
        )
        signature = await signature.json()

        // create meeting url // you can add custom parameters that you will parse in the iframe (ex: ending time)
        const joinUrl =
            getCurrentDomain() + '/meeting?' + serialize(meetingConfig)
        return joinUrl
    } catch (error) {
        console.error(error)
    }
}
