'use server'

import { revalidateTag } from 'next/cache'

export async function revalidateTags(tag: string) {
  revalidateTag(tag)
  
}