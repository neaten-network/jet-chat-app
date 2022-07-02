<template>
  <div class="current-chatroom">
    <p v-if="chatName === 'messages'"><i class="fas fa-hashtag"></i> General</p>
    <p v-else><i class="fas fa-at"></i> {{ chatName }}</p>
  </div>
  <div class="chat-window">
    <div class="error" v-if="error">{{ error }}</div>
    <div v-if="documents" class="messages" ref="messages">
      <SingleMessage v-for="{ name, photoURL, message, createdAt, sender, id } in formattedChats" :key="id" :name="name" :photoURL="photoURL" :message="message" :createdAt="createdAt" :sender="sender === user?.uid"  />
    </div>
  </div>
</template>

<script>
import getCollection from '../composables/getCollection'
import getUser from '../composables/getUser'
import SingleMessage from '../components/SingleMessage.vue'
import { formatDistanceToNow } from 'date-fns'
import { computed, onUpdated, ref, watchEffect } from 'vue'

export default {
  components: { SingleMessage },
  props: [ 'chatName', 'chatId' ],
  setup(props) {
    const { error, documents} = getCollection('messages')
    const { user } = getUser()

    // Watch for the chatName value change
    // watchEffect(() => console.log(props.chatName))

    // Filter the documents based on sentTo doc property
    const formattedChats = computed(() => {
      if(documents.value && user.value) {
        const formattedDocs = documents.value.map(doc => {
          let time = formatDistanceToNow(doc.createdAt.toDate())
          return { ...doc, createdAt: time }
        })
        if(props.chatName !== 'messages') {
          return formattedDocs.filter(doc => {
            return doc.sentTo === props.chatName && doc.sender === user.value.uid || doc.sender === props.chatId && doc.sentTo === user.value.displayName
          })
        } else {
          return formattedDocs.filter(doc => {
            return doc.sentTo === 'messages'
          })
        }
      }
    })


    // Auto-scroll to bottom of messages
    const messages = ref(null)

    onUpdated(() => {
      messages.value.scrollTop = messages.value.scrollHeight
    })

    return { error, documents, formattedChats, messages, user }
  }
}
</script>

<style>
  .current-chatroom {
    padding: 1rem 2rem;
  }
  .current-chatroom i {
    color: #004dfc;
  }
  .current-chatroom p {
    font-size: 2rem;
    font-weight: 100;
    text-transform: capitalize;
  }
  .chat-window {
    background: #f3f6fb;
    padding: 1.5rem 2rem 0;
    height: 650px;
    max-height: 650px;
    overflow: auto;
  }
  .chat-window .messages {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  /* Media Query */
   @media (min-width: 2500px) {
    .chat-window {
      height: 100%;
      max-height: 100%;
    }
  }
  @media (max-width: 1450px) {
    .chat-window {
      height: 100%;
      max-height: 100%;
      max-width: 100vw;
    }
  }
  @media (max-width: 768px) {
    .current-chatroom {
      text-align: center;
      padding: 2rem;
    }
    .chat-window {
      padding: 1.5rem 1rem 0;
    }
  }
</style>