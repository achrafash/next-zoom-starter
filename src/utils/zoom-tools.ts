export const getCurrentDomain = () => {
    return (
        window.location.protocol +
        '//' +
        window.location.hostname +
        ':' +
        window.location.port
    )
}

export const createZoomNode = (id: string, url: string) => {
    const zoomIframe = document.createElement('iframe')
    zoomIframe.id = id
    zoomIframe.setAttribute(
        'sandbox',
        'allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox'
    )
    zoomIframe.setAttribute('allow', 'microphone; camera; fullscreen;')
    zoomIframe.src = url
    zoomIframe.setAttribute('style', '')
    if (typeof document.body.append === 'function') {
        document.body.append(zoomIframe)
    } else {
        document.body.appendChild(zoomIframe)
    }
}

export const isMobileDevice = () => {
    return (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
    )
}

export const serialize = function (obj: Object) {
    // eslint-disable-next-line no-shadow
    var keyOrderArr = [
        'name',
        'mn',
        'email',
        'pwd',
        'role',
        'lang',
        'signature',
        'china'
    ]

    Array.intersect = function () {
        var result = new Array()
        var obj = {}
        for (var i = 0; i < arguments.length; i++) {
            for (var j = 0; j < arguments[i].length; j++) {
                var str = arguments[i][j]
                if (!obj[str]) {
                    obj[str] = 1
                } else {
                    obj[str]++
                    if (obj[str] == arguments.length) {
                        result.push(str)
                    }
                }
            }
        }
        return result
    }

    if (!Array.prototype.includes) {
        Object.defineProperty(Array.prototype, 'includes', {
            enumerable: false,
            value: function (obj) {
                var newArr = this.filter(function (el) {
                    return el === obj
                })
                return newArr.length > 0
            }
        })
    }

    var tmpInterArr = Array.intersect(keyOrderArr, Object.keys(obj))
    var sortedObj = []
    keyOrderArr.forEach(function (key) {
        if (tmpInterArr.includes(key)) {
            sortedObj.push([key, obj[key]])
        }
    })
    Object.keys(obj)
        .sort()
        .forEach(function (key) {
            if (!tmpInterArr.includes(key)) {
                sortedObj.push([key, obj[key]])
            }
        })
    var tmpSortResult = (function (sortedObj) {
        var str = []
        for (var p in sortedObj) {
            if (typeof sortedObj[p][1] !== 'undefined') {
                str.push(
                    encodeURIComponent(sortedObj[p][0]) +
                        '=' +
                        encodeURIComponent(sortedObj[p][1])
                )
            }
        }
        return str.join('&')
    })(sortedObj)
    return tmpSortResult
}
