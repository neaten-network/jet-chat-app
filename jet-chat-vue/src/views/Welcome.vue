<template>
  <div class="welcome container">
    <h1><span class="logo"><i class="fas fa-rocket fa-icon"></i> JetChat</span></h1>
    <div v-if="showLogin">
      <h2>LogIn</h2>
      <LoginForm @login="enterChat"/>
      <p>No account yet? <span @click="showLogin = false">Sign-up</span> instead</p>
    </div>
    <div v-else>
      <h2>Sign Up</h2>
      <SignupForm @signup="enterChat"/>
      <p>Already have an account? <span @click="showLogin = true">Login</span> instead</p>
    </div>
  </div>
</template>

<script>
import SignupForm from '../components/SignupForm.vue'
import LoginForm from '../components/LoginForm.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  components: { SignupForm, LoginForm },
  setup() {
    const showLogin = ref(true)
    const router = useRouter()

    // Redirect to chatroom after log in or sign up
    const enterChat = () => {
      router.push({ name: 'Chatroom' })
    }

    return { showLogin, enterChat }
  }
}
</script>

<style>
  .welcome {
    text-align: center;
    padding: 4rem 0;
  }
  .welcome h2 {
    padding: 2rem 0;
  }
  .welcome .logo {
    text-decoration: none;
    color: #004dfc;
    font-weight: bold;
  }
  /* Form styles */
  .welcome form {
    width: 300px;
    margin: 2rem auto;
    padding: 0 2rem;
  }
  .welcome label {
    display: block;
    margin: 2rem 0 1rem;
  }
  .welcome input {
    width: 100%;
    padding: 1rem;
    border-radius: 2rem;
    border: 1px solid #eee;
    outline: none;
    color: #999;
    margin: 1rem auto;
  }
  .welcome input:focus {
    border: 1px solid #004dfc
  }
  .welcome div span {
    font-weight: bold;
    text-decoration: underline;
    color: #004dfc;
    cursor: pointer;
  }
  .welcome button {
    margin: 2rem auto;
  }
</style>