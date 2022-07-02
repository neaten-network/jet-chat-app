<template>
  <nav class="nav" :class="{ show: showNav }" v-if="user">
    <div class="logo-settings">
      <h1 class="logo"><i class="fas fa-rocket fa-icon"></i> JetChat</h1>
      <i @click="showNav = !showNav" class="fas fa-cog user-settings-icon"></i>
    </div>
    <div class="user-menu">
      <div v-if="!formActive" class="user-info">
        <div class="user-image-info">
          <div class="profile-image">
            <img
              v-if="user.photoURL"
              :src="user.photoURL"
              class="user-avatar"
            />
            <span class="profile-status" :class="{ online: user }"></span>
          </div>
          <span @click="formActive = !formActive" class="upload-image-icon"
            >+</span
          >
        </div>
        <h3 class="display-name">
          Welcome,
          <span class="display-name-color">{{ user.displayName }}</span>
        </h3>
        <p class="email">Currently logged in as {{ user.email }}</p>
        <button @click="handleLogout">Logout</button>
      </div>

      <div v-if="formActive" class="upload-image-form">
        <form>
          <h3>Set a Profile image</h3>
          <input type="file" @change="handleChange" />
          <div class="error">{{ fileError }}</div>
          <div class="button-group">
            <button @click.prevent="formActive = !formActive">Cancel</button>
            <button @click.prevent="handleSubmit">Submit</button>
          </div>
        </form>
      </div>
    </div>

    <div @click="showChat = !showChat" class="hide-show-info">
      <h2>Main Channel</h2>
      <span
        ><i v-if="!showChat" class="fas fa-chevron-down hide-chanel-icon"></i>
        <i v-if="showChat" class="fas fa-chevron-up show-chanel-icon"></i
      ></span>
    </div>
    <div v-if="showChat" class="chatroom-menu" @click="getChatName('messages')">
      <div class="single-chatroom">
        <h3><i class="fas fa-hashtag fa-icon"></i> General</h3>
        <i class="fas fa-chevron-right chat-select-icon"></i>
      </div>
    </div>

    <div @click="showUsers = !showUsers" class="hide-show-info">
      <h2>Chat Users</h2>
      <span
        ><i v-if="!showUsers" class="fas fa-chevron-down hide-chanel-icon"></i>
        <i v-if="showUsers" class="fas fa-chevron-up show-chanel-icon"></i
      ></span>
    </div>
    <div v-if="showUsers" class="users-info">
      <div
        class="chat-user"
        v-for="user in users"
        :key="user"
        @click="getChatName(user.displayName, user.id)"
      >
        <div class="chat-user-info">
          <div class="chat-user-profile-image">
            <span
              class="profile-status"
              :class="{ online: user.status === 'online' }"
            ></span>
            <img
              v-if="user.photoURL"
              :src="user.photoURL"
              class="user-avatar"
            />
          </div>
          <div>
            <h3 class="chat-user-display-name">{{ user.displayName }}</h3>
            <span class="subname-text">Open chat</span>
          </div>
        </div>
        <span><i class="fas fa-chevron-right chat-select-icon"></i></span>
      </div>
    </div>
  </nav>
</template>

<script>
import useLogout from "../composables/useLogout";
import getUser from "../composables/getUser";
import getUsers from "../composables/getUsers";
import useStorage from "../composables/useStorage";
import { projectFirestore } from "../firebase/config";
import { projectAuth } from "../firebase/config";
import { ref, watchEffect } from "vue";

export default {
  setup(props, context) {
    const { logout, error } = useLogout();
    const { user } = getUser();
    const { users } = getUsers("users", user);
    const { url, filePath, uploadImage } = useStorage();

    const docRef = projectFirestore.collection("users").doc(user.value.uid);

    const formActive = ref(false);
    const showNav = ref(false);
    const showChat = ref(false);
    const showUsers = ref(true);

    // Upload a profile image
    const file = ref(null);
    const fileError = ref(null);

    // Handle Upload Image
    const handleSubmit = async () => {
      if (file.value) {
        await uploadImage(file.value);
        // Update the current user's data(Store the photoURL)
        const currentUser = projectAuth.currentUser;
        await currentUser.updateProfile({
          photoURL: url.value,
        });
        // Update the current user's data(Store the photoURL) in the firestore 'users collection
        await docRef.update({
          photoURL: url.value,
        });
        formActive.value = !formActive;
      }
    };

    // Allowed image types
    const types = ["image/png", "image/jpeg"];

    const handleChange = (e) => {
      const selected = e.target.files[0];

      if (selected && types.includes(selected.type)) {
        file.value = selected;
        fileError.value = null;
      } else {
        file.value = null;
        fileError.value = "Please select an image file (png or jpg)";
      }
    };

    // Check if any other chat users are online and set their status to "online"
    const isOnline = async () => {
      if (user.value) {
        await docRef.update({
          status: "online",
        });
      }
    };

    // Set a user status to "offline" when a user logs out
    watchEffect((onInvalidate) => {
      onInvalidate(async () => {
        await docRef.update({
          status: "offline",
        });
      });
    });

    isOnline();

    // Log user out
    const handleLogout = async () => {
      await logout();
      if (!error.value) {
        console.log("user logged out");
      }
    };

    // Getting the value for the doc sentTo property
    const chatName = ref("");

    const getChatName = (user, id) => {
      const result = user;
      chatName.value = result;
      context.emit("getChat", chatName.value, id);
      showNav.value = false;
    };

    return {
      handleLogout,
      user,
      users,
      getChatName,
      formActive,
      handleChange,
      handleSubmit,
      fileError,
      showNav,
      showChat,
      showUsers,
    };
  },
};
</script>

<style>
.nav {
  padding-right: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.nav h2 {
  margin: 1rem 0 0;
  padding: 1rem;
  font-size: 2rem;
  cursor: pointer;
}
.nav .logo {
  margin-bottom: 2rem;
  font-weight: bold;
}
.nav .user-settings-icon {
  display: none;
}
/* User Profile Styles */
.user-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f6fb;
  border-radius: 2rem;
  padding: 2rem;
  border: 1px solid #eee;
  width: 270px;
  height: 240px;
}
.nav .user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.user-image-info {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav .profile-image {
  position: relative;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: url("../assets/images/default-img.jpeg") no-repeat center
    center/cover;
  margin-bottom: 1rem;
  border: 2px solid #839edf;
  z-index: 1;
}
.nav .user-avatar {
  background-size: cover;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.nav .profile-image .profile-status {
  position: absolute;
  right: 0;
  bottom: 0;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: rgb(96, 97, 96);
  border: 2px solid #839edf;
}
.nav .upload-image-form form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
.nav .upload-image-form h3 {
  margin-bottom: 2rem;
  font-weight: 100;
  font-size: 2.2rem;
}
.nav .upload-image-form label {
  margin-bottom: 2rem;
}
.nav .upload-image-form input::-webkit-file-upload-button {
  visibility: hidden;
  width: 0px;
}
.nav .upload-image-form input::before {
  content: "Select Image";
  display: inline-block;
  background: #fff;
  color: #000;
  border: none;
  border-radius: 2rem;
  padding: 1rem;
  margin-left: 1rem;
  outline: none;
  white-space: nowrap;
  cursor: pointer;
  font-weight: 100;
  font-size: 1.4rem;
  text-align: center;
  transition: all 0.2s ease;
}
.nav .upload-image-form input:hover:before {
  border: none;
  background: #004dfc;
  color: #fff;
}
.nav .button-group {
  display: flex;
  justify-content: space-around;
  width: 100%;
}
.nav .button-group button {
  padding: 1rem 3rem;
}
.nav .upload-image-icon {
  font-size: 3rem;
  position: absolute;
  left: 55px;
  top: 0;
  font-weight: 100;
  color: #004dfc;
  background: #fff;
  padding: 0.1rem 0.9rem;
  border-radius: 50%;
  border: 2px solid #839edf;
  cursor: pointer;
  opacity: 0.5;
}
.nav .upload-image-icon:hover {
  opacity: 1;
  z-index: 2;
}
.nav .profile-image .profile-status.online,
.nav .chat-user-profile-image .profile-status.online {
  background: lightgreen;
}
.nav .display-name {
  font-weight: 100;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}
.nav .display-name-color {
  color: #004dfc;
}
.nav .email {
  font-size: 1.4rem;
  color: #999;
}
.nav button {
  margin-top: 2rem;
}
.nav .hide-show-info {
  display: flex;
  align-items: flex-end;
}
.nav .hide-chanel-icon,
.nav .show-chanel-icon {
  color: #999;
  cursor: pointer;
  margin-bottom: 1.5rem;
}
/* Users Styles */
.nav .users-info {
  width: 100%;
  height: 220px;
  padding-right: 1rem;
  overflow: auto;
}
/* Scrollbar */
.nav .users-info::-webkit-scrollbar {
  width: 0.7rem;
}
.nav .users-info::-webkit-scrollbar-track {
  background: #eee;
  border-radius: 2rem;
}
.nav .users-info::-webkit-scrollbar-thumb {
  background-color: #004dfc;
  border-radius: 2rem;
}
.nav .chat-user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.8rem 2rem;
  border-radius: 2rem;
  cursor: pointer;
}
.nav .chat-user:hover {
  background: #f3f6fb;
}
.nav .chat-user:hover .chat-select-icon {
  opacity: 1;
}
.nav .chat-user:hover .subname-text {
  opacity: 1;
}
.nav .chat-user-profile-image {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: url("../assets/images/default-img-2.jpg") no-repeat center
    center/cover;
  margin-right: 1rem;
  border: 2px solid #839edf;
}
.nav .chat-user-profile-image .profile-status {
  position: absolute;
  right: 0;
  bottom: 0;
  height: 15px;
  width: 15px;
  border-radius: 50%;
  background: rgb(96, 97, 96);
  border: 2px solid #839edf;
}
.nav .chat-user-info {
  display: flex;
  align-items: center;
}
.nav .chat-user-display-name {
  font-size: 1.8rem;
  font-weight: 100;
}
.nav .subname-text {
  opacity: 0;
  font-size: 1.3rem;
  color: #999;
  transition: all 0.2s ease;
}
/* Chat Menu Styles */
.nav .chatroom-menu {
  width: 100%;
}
.nav .single-chatroom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem 2rem;
  cursor: pointer;
}
.nav .single-chatroom:hover {
  background: #f3f6fb;
  border-radius: 2rem;
}
.nav .single-chatroom h3 {
  margin: 0;
  font-weight: 100;
}
.nav .chat-select-icon {
  opacity: 0;
  transition: all 0.2s ease;
  color: #999;
}
.nav .single-chatroom:hover .chat-select-icon {
  opacity: 1;
}
/* Media Query */
@media (min-width: 2500px) {
  /* Users Styles */
  .nav .users-info {
    height: 420px;
  }
}
@media (max-width: 1450px) {
  .nav {
    padding: 1.2rem 2rem 2rem;
  }
  /* Users Styles */
  .nav .users-info {
    height: 300px;
  }
}
@media (max-width: 768px) {
  /* Nav Default Styles */
  .nav {
    position: absolute;
    z-index: 1;
    background: transparent;
    height: 100vh;
    width: 320px;
    padding-right: 1rem;
    pointer-events: none;
    transform: translateX(-85%);
    transition: all 0.4s ease-out;
  }
  /* Scrollbar */
  .nav .users-info::-webkit-scrollbar {
    display: none;
  }
  .nav.show .users-info::-webkit-scrollbar {
    display: block;
  }
  .nav.show {
    transform: translateX(0);
    background: #fff;
    pointer-events: all;
    padding-right: 2rem;
  }
  .nav .logo-settings {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .nav .user-settings-icon {
    display: block;
    margin-bottom: 2.8rem;
    color: #000;
    font-size: 2.4rem;
    margin-left: 1rem;
    top: 0;
    left: 0;
    z-index: 10;
    transition: all 0.4s ease-out;
    pointer-events: all;
  }
  .nav.show .user-settings-icon {
    transform: rotate(255deg);
  }
  .nav .single-chatroom,
  .nav .chat-user {
    width: 70%;
  }
  /* User Profile Styles */
  .user-menu {
    width: 250px;
    height: 240px;
  }
}
@media (max-width: 425px) {
  .nav h2 {
    font-size: 1.8rem;
  }
}
</style>
