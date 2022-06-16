import { TypeStatus } from '@redux/features/player/palyerSlice.interface'
import { ICommonTagsResult } from 'music-metadata/lib/type'

export interface IMusicMetadata extends ICommonTagsResult {
  duration?: number
  tags?: string[]
  status?: TypeStatus
  permalink?: string
}
