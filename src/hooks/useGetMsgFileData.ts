import { ref, onMounted } from 'vue'
export const useGetMsgFileData = () => {
    const inputElement = ref<HTMLInputElement>()
    const fileData = ref<File>()
    const EventCallback = ref<() => void>()
    onMounted(() => {
        inputElement.value = window.document.createElement('input')
        inputElement.value.type = 'file'
        inputElement.value.addEventListener('change', () => {
            if (inputElement.value?.files?.length) {
                fileData.value = inputElement.value.files[0]
                EventCallback.value && EventCallback.value()
            }
        })
    })

    const checkMsgFileData = (callback: () => void) => {
        console.log(inputElement.value)
        inputElement.value?.click()
        if (inputElement.value) {
            EventCallback.value = callback
        }
    }

    return {
        inputElement,
        fileData,
        checkMsgFileData,
    }
}
