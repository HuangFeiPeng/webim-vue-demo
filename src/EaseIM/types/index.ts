import { EasemobChat } from '@/EaseIM'
export type EMMessageBody =
    | EasemobChat.TextMsgBody
    | EasemobChat.ImgMsgBody
    | EasemobChat.FileMsgBody
    | EasemobChat.CmdMsgBody
    | EasemobChat.LocationMsgBody
    | EasemobChat.AudioMsgBody
    | EasemobChat.CustomMsgBody
    | EasemobChat.VideoMsgBody
