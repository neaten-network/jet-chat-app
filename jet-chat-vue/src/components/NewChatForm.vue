<template>
  <form class="chatform">
    <textarea type="text" placeholder="Type a message..." v-model="message" @keypress.enter.prevent="handleSubmit"></textarea>
    <button @click.prevent="handleSubmit">Send</button>
  </form>
  <div class="error">{{ error }}</div>
</template>

<script>
import { ref, watchEffect } from 'vue'
import getUser from '../composables/getUser'
import useCollection from '../composables/useCollection'
import { timestamp } from '../firebase/config'

export default {
  props: [ 'chatName' ],
  setup(props) {
    const { user } = getUser()
    const { addDoc, error } = useCollection('messages')

    // Watch for the chatName value change
    // watchEffect(() => console.log(props.chatName))

    const message = ref('')

    // Add a chat document to the database
    const handleSubmit = async () => {
      const chat = {
        name: user.value.displayName,
        photoURL: user.value.photoURL,
        message: message.value.trim(),
        createdAt: timestamp(),
        sender: user.value.uid,
        sentTo: props.chatName
      }

      if(message.value) {
        await addDoc(chat)
      }
      if(!error.value) {
        message.value = ''
      }
    }

    return { message, handleSubmit, error }
  }
}
</script>

<style>
  .chatform {
    padding: 1.5rem 2rem 2rem;
    background: #f3f6fb;
    height: 100px;
    min-height: 100px;
    width: 100%;
    display: flex;
  }
  .chatform textarea {
    width: 100%;
    max-width: 100%;
    height: 100%;
    min-height: 45px;
    padding: 1rem;
    box-sizing: border-box;
    border: none;
    border-radius: 1.5rem 0 0 1.5rem;
    font-family: inherit;
    outline: none;
    resize: none;
  }
  .chatform textarea::-webkit-scrollbar {
    display: none;
  }
  .chatform button {
    background: #fff;
    color: #004dfc;
    border-radius: 0 1.5rem 1.5rem 0;
  }
  @media (max-width: 435px) {
    .chatform {
      height: 160px;
      padding-bottom: 6rem;
    }
  }
</style>