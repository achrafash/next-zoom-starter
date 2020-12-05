import { FC, useState } from 'react'
import ZoomWindow from '@components/ZoomWindow'
import { getMeetingUrl } from '@utils/join-meeting'

const Page: FC = () => {
    const [meetingUrl, setMeetingUrl] = useState('')

    const handleClick = async () => {
        const meetingNumber = 'test'
        const role = 0
        const joinUrl = await getMeetingUrl(meetingNumber, role)
        if (joinUrl === undefined) {
            return console.log('Ooops something happened')
        }
        setMeetingUrl(joinUrl)
    }

    return (
        <main>
            {/* get meeting number and role here (and password maybe) */}
            <button onClick={handleClick}>Join meeting</button>
            <div>{meetingUrl && <ZoomWindow url={meetingUrl} />}</div>
        </main>
    )
}

export default Page
