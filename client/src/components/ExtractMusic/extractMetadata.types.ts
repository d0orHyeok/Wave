import { TypeStatus } from '@appTypes/types.type.'
import { ICommonTagsResult } from 'music-metadata/lib/type'

export interface IExtractMetadata extends ICommonTagsResult {
  duration?: number
  tags?: string[]
  status?: TypeStatus
  permalink?: string
}
