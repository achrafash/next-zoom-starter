import { FC } from 'react'

const ZoomWindow: FC<{ url: string }> = ({ url }) => {
    return (
        <div>
            <iframe src={url} frameBorder='0'></iframe>
        </div>
    )
}

export default ZoomWindow
