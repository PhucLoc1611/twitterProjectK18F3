import sharp from 'sharp'
import { getNameFromFullname, handleUploadImage } from '~/utils/file'
import { Request } from 'express'
import { UPLOAD_DIR } from '~/constants/dir'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import { MediaType } from '~/constants/enums'
import { Media } from '~/models/Other'
class MediasService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req) //đem từ uploadSingleImageController qua
    //xử lý file bằng sharp
    ////filepath là đường của file cần xử lý đang nằm trong uploads/temp
    //file.newFilename: là tên unique mới của file sau khi upload lên, ta xóa đuôi và thêm jpg
    const result: Media[] = await Promise.all(
      files.map(async (video) => {
        const { newFilename } = video
        return {
          url: isProduction
            ? `${process.env.HOST}/static/image/${newFilename}`
            : `http://localhost:${process.env.PORT}/static/image/${newFilename}`,
          type: MediaType.Video
        }
      })
    )
    return result
  }
}

const mediasService = new MediasService()
export default mediasService
