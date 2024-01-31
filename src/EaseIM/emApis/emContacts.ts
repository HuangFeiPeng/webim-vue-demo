import { EMClient } from '../index'
import {} from 'easemob-websdk/types/indexApi'
import { useContactsStore } from '@/stores'
type ContactRemarkType = Parameters<typeof EMClient.contact.setContactRemark>[0]
export const emContacts = () => {
    const contactsStore = useContactsStore()
    const fetchContactsListFromServer = async () => {
        const res = await EMClient.contact.getAllContacts()
        if (res?.data) {
            contactsStore.contactsList = res.data
            return (contactsStore.contactsList = res.data)
        }
    }
    const removeContactFromServer = (contactId: string) => {
        return EMClient.contact.deleteContact(contactId)
    }
    const addContactFromServer = (contactId: string, applyMsg = '加个好友吧') => {
        return EMClient.contact.addContact(contactId, applyMsg)
    }

    const acceptContactInvite = (contactId: string) => {
        return EMClient.contact.acceptContactInvite(contactId)
    }
    const declineContactInvite = (contactId: string) => {
        return EMClient.contact.declineContactInvite(contactId)
    }
    const getBlocklistFromServer = () => {
        return EMClient.contact.getBlocklist()
    }
    const addUsersToBlocklist = (userList: string[]) => {
        return EMClient.contact.addUsersToBlocklist({ name: [...userList] })
    }
    const removeUsersFromBlocklist = (userList: string[]) => {
        return EMClient.contact.removeUserFromBlocklist({ name: [...userList] })
    }
    const setContactRemarkFromServer = (params: ContactRemarkType) => {
        return EMClient.contact.setContactRemark(params)
    }
    return {
        fetchContactsListFromServer,
        removeContactFromServer,
        addContactFromServer,
        acceptContactInvite,
        declineContactInvite,
        getBlocklistFromServer,
        addUsersToBlocklist,
        removeUsersFromBlocklist,
        setContactRemarkFromServer,
    }
}
