interface ImageSizeParams {
    width: number
    height: number
    src: string
}
export const getImageSize = (imgFile: File) => {
    return new Promise<ImageSizeParams>((resolve, reject) => {
        const url = window.URL || window.webkitURL
        const imageSize: ImageSizeParams = {
            width: 0,
            height: 0,
            src: '',
        }

        const img = new Image()
        img.src = url.createObjectURL(imgFile) //创建Image的对象的url
        img.onload = () => {
            console.log('>>>>>图片load')
            imageSize.src = img.src
            imageSize.width = img.width
            imageSize.height = img.height
            return resolve(imageSize)
        }
    })
}
