import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from 'zod';
import sharp from 'sharp'
import { db } from '@/db'

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .input(z.object({ configId: z.string().optional() }))
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input }) => {

      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {

      const { configId } = metadata.input

      const res = await fetch(file.url)
      const buffer = await res.arrayBuffer()

      const imgMetadata = await sharp(buffer).metadata()
      const { width, height } = imgMetadata

      if (!configId) {
        const configuration = await db.configuration.create({
          data: {
            imageUrl: file.url,
            height: height || 500,
            width: width || 500,
          },
        })
        return { configId: configuration.id }
      } else {
        const updatedConfiguration = await db.configuration.update({
          where: {
            id: configId,
          },
          data: {
            croppedImageUrl: file.url,
          },
        })
        
        return { configId: updatedConfiguration.id }
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;