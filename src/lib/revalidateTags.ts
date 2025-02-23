'use server'

import { revalidateTag } from 'next/cache'

export async function revalidateTags(tag: string[]) {
  for (const t of tag) {
    revalidateTag(t)
  }
  
}