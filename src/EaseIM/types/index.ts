export enum LISTENNER_EVENT_NAME {
    connect = 'connectEvent',
    contacts = 'contactsEvent',
    groups = 'groupsEvent',
    messages = 'messagesEvent',
    presence = 'presenceEvent',
}
export interface SystemNotfiParams {
    title: string
    content?: string
    notifType: 'contacts' | 'groups'
    groupId?: string
    from: string
    to: string
    time: number
    type: string
    isReaded: boolean
    isNeedHandle: boolean
    confirm?: boolean
    reject?: boolean
}
