import { EasemobChat } from '@/EaseIM'
export type EMMsgType =
    | EasemobChat.TextMsgBody
    | EasemobChat.ImgMsgBody
    | EasemobChat.FileMsgBody
    | EasemobChat.CmdMsgBody
    | EasemobChat.LocationMsgBody
    | EasemobChat.AudioMsgBody
    | EasemobChat.CustomMsgBody
    | EasemobChat.VideoMsgBody

export type MessageType = EasemobChat.MessageBody
export type EMCreateMsg =
    | EasemobChat.CreateTextMsgParameters
    | EasemobChat.CreateImgMsgParameters
    | EasemobChat.CreateCmdMsgParameters
    | EasemobChat.CreateFileMsgParameters
    | EasemobChat.CreateVideoMsgParameters
    | EasemobChat.CreateCustomMsgParameters
    | EasemobChat.CreateLocationMsgParameters
    | EasemobChat.CreateAudioMsgParameters
type AllowedMsgType = 'txt' | 'img' | 'file' | 'custom' | 'video' | 'audio'
export type EMCreateMsgBodyType = EMCreateMsg & { time: number | string; type: AllowedMsgType; thumb: string }
