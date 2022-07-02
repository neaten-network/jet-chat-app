<template>
  <div class="container chatroom-display">
    <Navbar @getChat="getName"/>
    <div class="chatroom">
      <ChatWindow :chatName="chatName" :chatId="chatId"/>
      <NewChatForm :chatName="chatName"/>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import NewChatForm from '../components/NewChatForm.vue'
import ChatWindow from '../components/ChatWindow.vue'
import getUser from '../composables/getUser'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

export default {
  components: { Navbar, NewChatForm, ChatWindow },
  setup() {
    const { user } = getUser()
    const router = useRouter()

    const chatName = ref('messages')
    const chatId = ref('')

    // Get the direct chat User display name
    const getName = (user, id) => {
      chatName.value = user
      chatId.value = id
    }


    // Redirect to welcome page if user isn't signed in
    watch(user, () => {
      if(!user.value) {
        router.push({ name: 'Welcome' })
      }
    })


    return { getName, chatName, chatId }

  }
}
</script>

<style>
  .container.chatroom-display {
    display: grid;
    grid-template-columns: 1fr 3fr;
    padding: 2rem;
    width: 100%;
    max-width: 1200px;
    height: 80vh;
  }
  .chatroom {
    height: 100%;
    min-width: 350px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid #eee;
    border-radius: 2rem;
  }
  /* Media Query */
  @media (max-width: 1450px) {
    .container.chatroom-display {
      position: relative;
      height: 100vh;
      width: 100vw;
      max-width: 100vw;
      overflow: hidden;
      padding: 0;
    }
    .chatroom {
      height: 100vh;
      border-radius: 0;
      border: none;
      border-left: 1px solid #eee;
    }
  }
  @media (max-width: 768px) {
    .chatroom {
      width: 100vw;
      min-width: 320px;
    }
  }
</style>